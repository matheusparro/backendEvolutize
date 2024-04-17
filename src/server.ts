import express from 'express';
import cors from 'cors';
import WebPush from 'web-push';

const app = express();

app.use(express.json());
app.use(cors());

// WebPush
console.log(WebPush.generateVAPIDKeys())
const {publicKey,privateKey} = WebPush.generateVAPIDKeys()
WebPush.setVapidDetails('https://backendevolutize.onrender.com', publicKey, privateKey);



// Routes

interface ISubscription {
  subscription: {
    endpoint: string;
    keys: {
      p256dh: string;
      auth: string;
    };
  };
}

app.get('/notification/push/public_key', (request, response) => {
  return response.json({ publicKey });
});
app.get('/', (request, response) => {
  return response.send("TESTE");
});

app.post('/notification/push/register', (request, response) => {
  console.log(request.body);

  return response.sendStatus(201);
});

app.post('/notification/push/send', async (request, response) => {
  const { subscription } = request.body as ISubscription;

  WebPush.sendNotification(
    subscription,
    JSON.stringify({
      icon: 'your-icon-link.png',
      title: 'NOTIFICAÇÃO EVOLUTIZE',
      body: 'Content of your message',
      imageUrl: 'your-image-link.png'
    }),
  );

  return response.sendStatus(201);
});

app.listen(3333, () => console.log('SERVER IS RUNNING AT :3333'));
