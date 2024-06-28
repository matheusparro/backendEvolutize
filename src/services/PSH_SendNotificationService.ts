import { PrismaClient } from '@prisma/client';
import { IPushMessage, ISubscription } from '../commonInterfaces/interfaces';
import webPush from '../config/webPushConfig';
import AppError from '../errorException/AppError';

// Interface para os dados da mensagem de push



const prisma = new PrismaClient();

// Configuração das chaves VAPID para WebPush
// const publicKey = 'BBsXYqVS8EFi29zDPFD_uFUg11oaKBowNRqk-O-WqP3cmzzQOuSyCTUGUsStGtZFKEz8f2XYEx-mDawfhCg4hAM';
// const privateKey = 'akUfQDG1egwhDbLFzg__48BYOSuV9kti4upgRKGX8KU';
// webPush.setVapidDetails('https://localhost:3333', publicKey, privateKey);

// Serviço para enviar notificações push
export default class PSH_SendNotificationService {
  // Método para enviar notificações push para usuários específicos
  async sendNotifications(users: string[], body: IPushMessage): Promise<void> {
    try {
      // Busca os usuários com as chaves de notificação
      const usersFound = await prisma.pSH_Usuario.findMany({
        where: {
          PSH_UsuarioChave: {
            in: users,
          },
        },
      });

      // Busca os endpoints de notificação dos usuários encontrados
      const endpointsUsers = await prisma.pSH_UsuarioEndpoint.findMany({
        where: {
          PSH_UsuarioId: {
            in: usersFound.map((user) => user.PSH_UsuarioId),
          },
        },
      });

      // Constrói o payload da notificação
      const notificationPayload = JSON.stringify({
        icon: body.message.icon,
        title: body.message.title,
        body: body.message.body,
        url: body.message.url,
        imageUrl: body.message.imageUrl,
      });

      // Verifica se há endpoints de usuário encontrados
      if (endpointsUsers.length !== 0) {
        // Cria um registro de log de notificação
        const logNotificacao = await prisma.pSH_NotificacaoLog.create({
          data: {
            PSH_NotificacaoLogCreatedAt: new Date(),
            PSH_NotificacaoLogBody: notificationPayload,
            PSH_NotificacaoLogIcon: body.message.icon,
            PSH_NotificacaoLogStatus: 'S',
            PSH_NotificacaoLogTitle: body.message.title,
            PSH_NotificacaoLogUpdatedAt: new Date(),
            PSH_NotificacaoLogUrl: body.message.url,
            PSH_NotificacaoLogImgUrl: body.message.imageUrl,
            TEC_AplicacaoId: body.TEC_AplicacaoId,
            TEC_ClienteCodigo: body.TEC_ClienteCodigo,
          },
        });

        // Itera sobre os endpoints de usuário para enviar notificações push
        for (const endpointUser of endpointsUsers) {
          try {
            // Busca o endpoint específico
            const endpoint = await prisma.pSH_Endpoint.findFirst({
              where: {
                PSH_EndpointId: endpointUser.PSH_EndpointId,
                NOT: [{ PSH_EndpointAuth: null }, { PSH_EndpointAuth: '' }],
              },
            });

            // Se não houver endpoint válido, continua para o próximo
            if (!endpoint) {
              continue;
            }

            // Cria a estrutura de assinatura para enviar a notificação
            const subscription: ISubscription = {
              endpoint: endpoint.PSH_EndpointEndpoint as string,
              keys: {
                auth: endpoint.PSH_EndpointAuth as string,
                p256dh: endpoint.PSH_EndpointP256dh as string,
              },
            };

            // Envia a notificação push para o endpoint
            const notificationSend = await webPush.sendNotification(subscription, notificationPayload);

            // Verifica se a resposta da notificação indica que o usuário cancelou a inscrição
            if (notificationSend.body.includes('unsubscribed') || notificationSend.body.includes('expired')) {
              // Executa transação para deletar o endpoint e o relacionamento do usuário
              await prisma.$transaction(async (prismaTr) => {
                await prismaTr.pSH_Endpoint.delete({ where: { PSH_EndpointId: endpoint.PSH_EndpointId } });
                const whereUniqueInput = {
                  PSH_EndpointId_PSH_UsuarioId: {
                    PSH_EndpointId: endpointUser.PSH_EndpointId,
                    PSH_UsuarioId: endpointUser.PSH_UsuarioId,
                  },
                };
                await prismaTr.pSH_UsuarioEndpoint.delete({ where: whereUniqueInput });
              });

              // Cria um registro de log de usuário indicando a ação
              await prisma.pSH_NotificacaoLogUsuario.create({
                data: {
                  PSH_NotificacaoLogId: logNotificacao.PSH_NotificacaoLogId,
                  PSH_NotificacaoLogUsuarioMensa: 'Usuário cancelou a inscrição na notificação no navegador',
                  PSH_NotificacaoLogUsuarioStatu: 'E',
                  PSH_NotificacaoLogUsuarioId: endpointUser.PSH_UsuarioId,
                  PSH_NotificacaoLogUsuarioCreat: new Date(),
                },
              });
            }

            // Cria um registro de log de usuário indicando sucesso
            await prisma.pSH_NotificacaoLogUsuario.create({
              data: {
                PSH_NotificacaoLogId: logNotificacao.PSH_NotificacaoLogId,
                PSH_NotificacaoLogUsuarioMensa: 'Notificação Enviada com Sucesso',
                PSH_NotificacaoLogUsuarioStatu: 'S',
                PSH_NotificacaoLogUsuarioId: endpointUser.PSH_UsuarioId,
                PSH_NotificacaoLogUsuarioCreat: new Date(),
              },
            });
          } catch (error:any) {
            // Trata erros durante o envio da notificação
            if ((error.body?.includes('unsubscribed') || error.body?.includes('expired')) || error.endpoint?.includes("notify.windows") && error.statusCode === 410) {
              // Executa transação para deletar o endpoint e o relacionamento do usuário
              await prisma.$transaction(async (prismaTr) => {
                await prismaTr.pSH_Endpoint.delete({ where: { PSH_EndpointId: endpointUser.PSH_EndpointId } });
                const whereUniqueInput = {
                  PSH_EndpointId_PSH_UsuarioId: {
                    PSH_EndpointId: endpointUser.PSH_EndpointId,
                    PSH_UsuarioId: endpointUser.PSH_UsuarioId,
                  },
                };
                await prismaTr.pSH_UsuarioEndpoint.delete({ where: whereUniqueInput });
              });

              // Cria um registro de log de usuário indicando o erro
              await prisma.pSH_NotificacaoLogUsuario.create({
                data: {
                  PSH_NotificacaoLogId: logNotificacao.PSH_NotificacaoLogId,
                  PSH_NotificacaoLogUsuarioMensa: error.message,
                  PSH_NotificacaoLogUsuarioStatu: 'E',
                  PSH_NotificacaoLogUsuarioId: endpointUser.PSH_UsuarioId,
                  PSH_NotificacaoLogUsuarioCreat: new Date(),
                },
              });
            }
          }
        }
      }
    } catch (error) {
      // Trata erros durante o envio de notificações
      console.error('Erro ao enviar notificações push:', error);
      throw new AppError(500, 'Erro ao enviar notificações push.', 'SEND_NOTIFICATION_ERROR');

    }
  }
}
