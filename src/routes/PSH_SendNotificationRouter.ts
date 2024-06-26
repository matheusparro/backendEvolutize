import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import webPush from 'web-push';
interface IPushMessage {
    message:{
      icon: string,
      title: string,
      body: string,
      url: string,
    }
    users: string[]
    TEC_ClienteCodigo:string,
    TEC_AplicacaoId: number
  }

const router = express.Router();
const prisma = new PrismaClient();
const publicKey = 'BBsXYqVS8EFi29zDPFD_uFUg11oaKBowNRqk-O-WqP3cmzzQOuSyCTUGUsStGtZFKEz8f2XYEx-mDawfhCg4hAM'
const privateKey = 'akUfQDG1egwhDbLFzg__48BYOSuV9kti4upgRKGX8KU'
//webPush.setVapidDetails('https://backendevolutize.onrender.com', publicKey, privateKey);
webPush.setVapidDetails('https://localhost:3333', publicKey, privateKey);

async function sendNotifications(users: string[], body: IPushMessage) {
    try {
      const usersFound = await prisma.pSH_Usuario.findMany({
        where: {
          PSH_UsuarioChave: {
            in: users,
          },
        },
      });
  
      const endpointsUsers = await prisma.pSH_UsuarioEndpoint.findMany({
        where: {
          PSH_UsuarioId: {
            in: usersFound.map(user => user.PSH_UsuarioId),
          },
        },
      });
  
      const notificationPayload = JSON.stringify({
        icon: body.message.icon,
        title: body.message.title,
        body: body.message.body,
        url: body.message.url,
      });
      if(endpointsUsers.length != 0) {
        let logNotificacao = await prisma.pSH_NotificacaoLog.create({
            data: {
              PSH_NotificacaoLogCreatedAt: new Date(),
            PSH_NotificacaoLogBody: notificationPayload,
            PSH_NotificacaoLogIcon: body.message.icon,
            PSH_NotificacaoLogStatus: 'S',
            PSH_NotificacaoLogTitle: body.message.title,
            PSH_NotificacaoLogUpdatedAt: new Date(),
            PSH_NotificacaoLogUrl: body.message.url,
            TEC_AplicacaoId: body.TEC_AplicacaoId,
            TEC_ClienteCodigo : body.TEC_ClienteCodigo
            },  
        });
    
        for (const endpointUser of endpointsUsers) {
          try {
            const endpoint = await prisma.pSH_Endpoint.findFirst({
              where: {
                PSH_EndpointId: endpointUser.PSH_EndpointId,
                NOT: [
                  { PSH_EndpointAuth: null },
                  { PSH_EndpointAuth: "" },
                ],
              },
            });
  
            if (!endpoint) {
              continue;
            }
  
            interface ISubscription {
              endpoint: string;
              keys: {
                auth: string;
                p256dh: string;
              };
            }
  
            const subscription: ISubscription = {
              endpoint: endpoint.PSH_EndpointEndpoint as string,
              keys: {
                auth: endpoint.PSH_EndpointAuth as string,
                p256dh: endpoint.PSH_EndpointP256dh as string,
              },
            };
  
            const notificationSend = await webPush.sendNotification(subscription, notificationPayload);
  
            if (notificationSend.body.includes('unsubscribed') || notificationSend.body.includes('expired')) {
              await prisma.$transaction(async (prismaTr) => {
                await prismaTr.pSH_Endpoint.delete({ where: { PSH_EndpointId: endpoint.PSH_EndpointId } });
                const whereUniqueInput = {
                  PSH_EndpointId_PSH_UsuarioId: {
                    PSH_EndpointId: endpointUser.PSH_EndpointId,
                    PSH_UsuarioId: endpointUser.PSH_UsuarioId,
                  },
                };
                await prismaTr.pSH_UsuarioEndpoint.delete({
                  where: whereUniqueInput,
                });
  
              });
              await prisma.pSH_NotificacaoLogUsuario.create({
                data: {
                  PSH_NotificacaoLogId: logNotificacao.PSH_NotificacaoLogId, 
                  PSH_NotificacaoLogUsuarioMensa: 'Usuário cancelou a inscrição na notificação no navegador',
                  PSH_NotificacaoLogUsuarioStatu:'E',
                  PSH_NotificacaoLogUsuarioId: endpointUser.PSH_UsuarioId,
                  PSH_NotificacaoLogUsuarioCreat: new Date(),
                },
              });
            }
            await prisma.pSH_NotificacaoLogUsuario.create({
              data: {
                PSH_NotificacaoLogId: logNotificacao.PSH_NotificacaoLogId, 
                PSH_NotificacaoLogUsuarioMensa: 'Notificação Enviada com Sucesso',
                PSH_NotificacaoLogUsuarioStatu:'S',
                PSH_NotificacaoLogUsuarioId: endpointUser.PSH_UsuarioId,
                PSH_NotificacaoLogUsuarioCreat: new Date(),
              },
            });
          } catch (error: any) {
            if (error.body?.includes("unsubscribed") || error.body?.includes("expired")) {
              await prisma.pSH_Endpoint.delete({ where: { PSH_EndpointId: endpointUser.PSH_EndpointId } });
              const whereUniqueInput = {
                PSH_EndpointId_PSH_UsuarioId: {
                  PSH_EndpointId: endpointUser.PSH_EndpointId,
                  PSH_UsuarioId: endpointUser.PSH_UsuarioId,
                },
              };
              await prisma.pSH_UsuarioEndpoint.delete({
                where: whereUniqueInput,
              });
  
              // Crie um registro de log de usuário para indicar que houve um erro ao enviar a notificação push
              await prisma.pSH_NotificacaoLogUsuario.create({
                data: {
                  PSH_NotificacaoLogId: logNotificacao.PSH_NotificacaoLogId, 
                  PSH_NotificacaoLogUsuarioMensa: error.message,
                  PSH_NotificacaoLogUsuarioStatu:'E',
                  PSH_NotificacaoLogUsuarioId: endpointUser.PSH_UsuarioId,
                  PSH_NotificacaoLogUsuarioCreat: new Date(),
                },
              });
            }
          }
        }
      }else{
        await prisma.pSH_NotificacaoLog.create({
            data: {
              PSH_NotificacaoLogCreatedAt: new Date(),
            PSH_NotificacaoLogBody: notificationPayload,
            PSH_NotificacaoLogIcon: body.message.icon,
            PSH_NotificacaoLogStatus: 'E',
            PSH_NotificacaoLogTitle: body.message.title,
            PSH_NotificacaoLogUpdatedAt: new Date(),
            PSH_NotificacaoLogUrl: body.message.url,
            TEC_AplicacaoId: body.TEC_AplicacaoId,
            TEC_ClienteCodigo : body.TEC_ClienteCodigo,
            PSH_NotificacaoLogMsg: 'Nenhum usuário encontrado para enviar a notificação'
            },  
        });
      }
    } catch (error) {
      console.error("Erro ao enviar notificações push:", error);
    }
  }
  
  router.post('/notification/push/send', async (request: Request<{}, {}, IPushMessage>, response: Response) => {
    const { users, TEC_ClienteCodigo, TEC_AplicacaoId, message } = request.body;
  
    // Validação dos parâmetros da requisição
    if (!users || !TEC_ClienteCodigo || !TEC_AplicacaoId || !message) {
      return response.status(400).json({ error: 'Todos os parâmetros são obrigatórios: users, TEC_ClienteCodigo, TEC_AplicacaoId, message' });
    }
  
    // Dispara o processamento em background
    sendNotifications(users, request.body).catch((error) => {
      console.error("Erro ao processar notificações em background:", error);
    });
  
    // Retorna a resposta imediatamente
    return response.sendStatus(200);
  });
  
export default router;