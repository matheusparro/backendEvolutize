import express from 'express';
import cors from 'cors';
import WebPush from 'web-push';
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

// Interface para os dados da mensagem
interface PushMessage {
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
  message: PushMessage;
}

const prisma = new PrismaClient();
const app = express();

app.use(express.json());
app.use(cors());

// WebPush
const publicKey = 'BBsXYqVS8EFi29zDPFD_uFUg11oaKBowNRqk-O-WqP3cmzzQOuSyCTUGUsStGtZFKEz8f2XYEx-mDawfhCg4hAM'
const privateKey = 'akUfQDG1egwhDbLFzg__48BYOSuV9kti4upgRKGX8KU'
//WebPush.setVapidDetails('https://backendevolutize.onrender.com', 'BBsXYqVS8EFi29zDPFD_uFUg11oaKBowNRqk-O-WqP3cmzzQOuSyCTUGUsStGtZFKEz8f2XYEx-mDawfhCg4hAM', 'akUfQDG1egwhDbLFzg__48BYOSuV9kti4upgRKGX8KU');
//WebPush.generateVAPIDKeys();
WebPush.setVapidDetails('https://localhost:3333', publicKey, privateKey);

app.get('/notification/push/public_key', (request, response) => {
  return response.json({ publicKey });
});
app.get('/', (request, response) => {
  return response.send("TESTE");
});

app.post('/notification/push/register', async (request, response) => {
  const { subscription } = request.body as ISubscription;
  await prisma.user.create({
    data:{
      name:"Matheus",
      auth:subscription.keys.auth,
      endpoint: subscription.endpoint,
      p256dh: subscription.keys.p256dh,
    }
  })
  
  return response.sendStatus(201);
});


// Rota para enviar uma notificação push
app.post('/notification/push/send', async (request: Request<{}, {}, ISubscription>, response: Response) => {
  try {
    const { subscription, message } = request.body;

    // Enviar a notificação push com os dados da mensagem
    await WebPush.sendNotification(subscription, JSON.stringify({
      icon: message.icon,
      title: message.title,
      body: message.body,
      imageUrl: message.imageUrl
    }));

    return response.sendStatus(201);
  } catch (error:any) {
    return response.status(500).send('Erro ao enviar notificação.');
  }
});



app.listen(3333, () => console.log('SERVER IS RUNNING AT :3333'));
