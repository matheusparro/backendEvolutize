import express from 'express';
import cors from 'cors';
import WebPush from 'web-push';

const app = express();

app.use(express.json());
app.use(cors());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://frontevolutize.onrender.com');
  // Você também pode especificar várias origens ou '*' para permitir qualquer origem
  // res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  // Defina como true se precisar incluir cookies na solicitação
  // res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

// WebPush
const publicKey = 'BBsXYqVS8EFi29zDPFD_uFUg11oaKBowNRqk-O-WqP3cmzzQOuSyCTUGUsStGtZFKEz8f2XYEx-mDawfhCg4hAM'
WebPush.setVapidDetails('https://backendevolutize.onrender.com', 'BBsXYqVS8EFi29zDPFD_uFUg11oaKBowNRqk-O-WqP3cmzzQOuSyCTUGUsStGtZFKEz8f2XYEx-mDawfhCg4hAM', 'akUfQDG1egwhDbLFzg__48BYOSuV9kti4upgRKGX8KU');



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
  const { subscription } = request.body;
  return response.sendStatus(201);
});

app.post('/notification/push/send', async (request, response) => {
  const { subscription } = request.body as ISubscription;
  console.log("AQUI A SUBSCRICACAO"+JSON.stringify(subscription))
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
