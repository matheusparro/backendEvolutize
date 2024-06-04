import express, { NextFunction } from 'express';
import cors from 'cors';
import webPush from 'web-push';
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import USU_UsuarioService from './services/USU_Usuario.service';
import * as cls from 'cls-hooked';
import { PrismaTransactionScope } from './dataBase/PrismaTransactionScope';
import { PrismaClientManager } from './dataBase/PrismaClientManager';
import TEC_CanalRouter from './routes/TEC_Canal.routes';
import TEC_RegisterNotificationRouter from './routes/TEC_RegisterNotification.router';
import TEC_NotificationSyncRouter from './routes/TEC_NotificacaoSync.routes';
import USU_UsuarioCanalRouter from './routes/USU_UsuarioCanal.routes';
import TEC_EndpointRouter from './routes/TEC_Endpoint.routes';
// Interface para os dados da mensagem
interface IPushMessage {
  icon: string;
  title: string;
  body: string;
  imageUrl: string;
  TEC_CanalId: number;
  tec_canaisId: number[];
}
export interface ISubscription {

  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

const prisma = new PrismaClient();
const app = express();

app.use(express.json());
app.use(cors());

// WebPush
const publicKey = 'BBsXYqVS8EFi29zDPFD_uFUg11oaKBowNRqk-O-WqP3cmzzQOuSyCTUGUsStGtZFKEz8f2XYEx-mDawfhCg4hAM'
const privateKey = 'akUfQDG1egwhDbLFzg__48BYOSuV9kti4upgRKGX8KU'
//webPush.setVapidDetails('https://backendevolutize.onrender.com', publicKey, privateKey);
webPush.setVapidDetails('https://localhost:3333', publicKey, privateKey);

const transactionContext = cls.createNamespace('transaction');
const transactionScope = new PrismaTransactionScope(prisma, transactionContext);
const clientManager = new PrismaClientManager(prisma, transactionContext);

const usu_usuarioService = new USU_UsuarioService(transactionScope,clientManager);


const checkServerStatusMiddleware = async (request: Request, response: Response, next: NextFunction) => {
  try {
    // Testar uma consulta simples ao banco de dados
    await prisma.$connect();

    // Se a consulta for bem-sucedida, chamar o próximo middleware ou rota
    next();
  } catch (error) {
    // Se houver um erro ao conectar-se ao banco de dados, responder com status 500 e uma mensagem de erro
    console.error('Erro ao verificar o status do banco de dados:', error);
    return response.status(500).json({ 
      error: 'O servidor está online, mas ocorreu um erro ao conectar-se ao banco de dados.' 
    });
  }
};

// Aplicar o middleware a todas as solicitações
app.use(checkServerStatusMiddleware);
app.get('/notification/push/public_key', (request, response) => {
  return response.json({ publicKey });
});

app.get('/', (request, response) => {
  return response.send("TESTETESTETETETET");
});

// Rota para enviar uma notificação push
app.post('/notification/push/send/old', async (request: Request<{}, {}, IPushMessage>, response: Response) => {
  try {
    const message = request.body;
    let { tec_canaisId }: { tec_canaisId: number[] } = request.body;
     tec_canaisId = message.tec_canaisId.map(number => Number(number));
    
    const usersByCanal = await usu_usuarioService.getAllUsersByCanal(tec_canaisId);
    
    if (!usersByCanal || usersByCanal.length === 0) {
      return response.status(403).json({ error: "Nenhum usuário encontrado nos canais fornecidos." });
    }
    for(let index = 0; index < 700; index++){
    for (const user of usersByCanal) {
      const subscription: ISubscription = {
        endpoint: user.TEC_EndpointEndpoint,
        keys: {
          auth: user.TEC_EndpointAuth,
          p256dh: user.TEC_EndpointP256dh
        }
      };
      
      try {
        const notificationSend = await webPush.sendNotification(subscription, JSON.stringify({
          icon: message.icon,
          title: message.title,
          body: message.body,
          imageUrl: message.imageUrl
        }));
        
        if (notificationSend.body.includes("unsubscribed") || notificationSend.body.includes("expired")) {
          await prisma.uSU_USUARIO.delete({ where: { USU_UsuarioId: user.USU_UsuarioId } });
        }
      } catch (error:any) {
        console.error("Erro ao enviar notificação push:", error);
        if (error.body.includes("unsubscribed") || error.body.includes("expired")) {
          await prisma.tEC_ENDPOINT.delete({ where: { TEC_EndpointId: user.TEC_EndpointId } });
        }
      }
    }
  }
    return response.sendStatus(201);
  } catch (error) {
    console.error("Erro ao enviar notificação push:", error);
    return response.status(500).json({ error: "Erro ao enviar notificação push." });
  }
});


app.post('/notification/push/send', async (request: Request<{}, {}, IPushMessage>, response: Response) => {
  try {
    const message = request.body;
    let { tec_canaisId }: { tec_canaisId: number[] } = request.body;
    tec_canaisId = message.tec_canaisId.map(number => Number(number));

    const usersByCanal = await usu_usuarioService.getAllUsersByCanal(tec_canaisId);

    if (!usersByCanal || usersByCanal.length === 0) {
      return response.status(403).json({ error: "Nenhum usuário encontrado nos canais fornecidos." });
    }

    // Definição da função sendNotifications
    const sendNotifications = async () => {
      // for (let index = 0; index < 10000; index++) {
        const notificationPromises = usersByCanal.map(async (user: any) => {
          const subscription: ISubscription = {
            endpoint: user.TEC_EndpointEndpoint,
            keys: {
              auth: user.TEC_EndpointAuth,
              p256dh: user.TEC_EndpointP256dh
            }
          };

          try {
            if (index === 2 || index === 4) {
              throw new Error("Erro ao enviar notificação push");
            }

            const notificationSend = await webPush.sendNotification(subscription, JSON.stringify({
              icon: message.icon,
              title: message.title,
              body: message.body,
              imageUrl: message.imageUrl,
            }));

            if (notificationSend.body.includes("unsubscribed") || notificationSend.body.includes("expired")) {
              await prisma.uSU_USUARIO.delete({ where: { USU_UsuarioId: user.USU_UsuarioId } });
            }
          } catch (error: any) {
            console.error("Erro ao enviar notificação push:", error);
            if (error.body?.includes("unsubscribed") || error.body?.includes("expired")) {
              await prisma.tEC_ENDPOINT.delete({ where: { TEC_EndpointId: user.TEC_EndpointId } });
            }
            // Continue to the next user even if an error occurs
          }
        });

        await Promise.all(notificationPromises.map(p => p.catch(e => e)));
      // }
    };

    // Inicia o envio de notificações de forma assíncrona sem aguardar
    sendNotifications().catch(error => {
      console.error("Erro ao enviar notificações:", error);
    });

    return response.sendStatus(200); // Retorna imediatamente ao cliente
  } catch (error) {
    console.error("Erro ao enviar notificação push:", error);
    return response.status(500).json({ error: "Erro ao enviar notificação push." });
  }
});


app.use(TEC_CanalRouter);
app.use(TEC_RegisterNotificationRouter)
app.use(TEC_NotificationSyncRouter)
app.use(USU_UsuarioCanalRouter)
app.use(TEC_EndpointRouter)
// Rota para verificar se o servidor e o banco de dados estão online
app.get('/ping', async (request, response) => {
  try {
    // Testar uma consulta simples ao banco de dados
    await prisma.$connect();

    // Se a consulta for bem-sucedida, responder com status 200 e uma mensagem
    return response.status(200).json({ 
      sucess: 'Ping! O servidor e o banco de dados estão online.' 
    });
  } catch (error) {
    // Se houver um erro ao conectar-se ao banco de dados, responder com status 500 e uma mensagem de erro
    console.error('Erro ao verificar o status do banco de dados:', error);
    return response.status(500).json({ 
      error: 'O servidor está online, mas ocorreu um erro ao conectar-se ao banco de dados.' 
    });
  }
});

app.listen(3333);
