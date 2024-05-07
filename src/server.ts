import express from 'express';
import cors from 'cors';
import webPush from 'web-push';
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

// Interface para os dados da mensagem
interface IPushMessage {
  icon: string;
  title: string;
  body: string;
  imageUrl: string;
  socio: string;
}

interface ISubscription {
  subscription: {
    endpoint: string;
    keys: {
      p256dh: string;
      auth: string;
    };
  };
}

const prisma = new PrismaClient();
const app = express();

app.use(express.json());
app.use(cors());

// WebPush
const publicKey = 'BBsXYqVS8EFi29zDPFD_uFUg11oaKBowNRqk-O-WqP3cmzzQOuSyCTUGUsStGtZFKEz8f2XYEx-mDawfhCg4hAM'
const privateKey = 'akUfQDG1egwhDbLFzg__48BYOSuV9kti4upgRKGX8KU'
webPush.setVapidDetails('https://backendevolutize.onrender.com', publicKey, privateKey);
//webPush.setVapidDetails('https://localhost:3333', publicKey, privateKey);

app.get('/notification/push/public_key', (request, response) => {
  return response.json({ publicKey });
});

app.get('/', (request, response) => {
  return response.send("TESTETESTETETETET");
});

app.post('/notification/push/register', async (request, response) => {
  try {
    const { subscription } = request.body as ISubscription;
    await prisma.user.create({
      data: {
        endpoint: subscription.endpoint,
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth,
        name: "teste",
      }
    });
    
    return response.sendStatus(201);
  } catch (error) {
    console.error("Erro ao registrar usuário:", error);
    return response.status(500).json({ error: "Erro ao registrar usuário." });
  }
});

// Rota para enviar uma notificação push
app.post('/notification/push/send', async (request: Request<{}, {}, IPushMessage>, response: Response) => {
  try {
    const message = request.body;
    const users = await prisma.user.findMany();
    
    for (const user of users) {
      let subscription: ISubscription['subscription'] = {
        endpoint: user.endpoint,
        keys: {
          auth: user.auth,
          p256dh: user.p256dh
        }
      };

      try {
        const notificationSend =  webPush.sendNotification(subscription, JSON.stringify({
          icon: message.icon,
          title: message.title,
          body: message.body,
          imageUrl: message.imageUrl
        }));
      } catch (error) {
        console.error("Erro ao enviar notificação push para o usuário:", user.id, error);
      }
    }
    return response.sendStatus(201);
  } catch (error) {
    console.error("Erro ao enviar notificação push:", error);
    return response.status(500).json({ error: "Erro ao enviar notificação push." });
  }
});


app.listen(process.env.PORT || 3333);
