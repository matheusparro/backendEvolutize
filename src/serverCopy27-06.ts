import express, { NextFunction } from 'express';
import cors from 'cors';
import webPush from 'web-push';
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import PSH_RegisterNotificationRouter from './routes/PSH_RegisterNotificationRouter';
import PSH_EndpointRouter from './routes/PSH_EndpointRouter';
import PSH_SendNotificationRouter from './routes/PSH_SendNotificationRouter';

const prisma = new PrismaClient();
const app = express();

app.use(express.json());
app.use(cors());


// Middleware para verificar o status do servidor e do banco de dados
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

// Rota para obter a chave pública do WebPush
app.get('/notification/push/public_key', (request, response) => {
  const vapidPublicKey = String(process.env.PUBLIC_VAPID_KEY) 
  return response.status(200).json({ publicKey:vapidPublicKey });
});


app.use(PSH_RegisterNotificationRouter);
app.use(PSH_EndpointRouter);
app.use(PSH_SendNotificationRouter);

// Rota de ping para verificar status do servidor
app.get('/ping', async (request, response) => {
  try {
    // Testar uma consulta simples ao banco de dados
    await prisma.$connect();

    // Se a consulta for bem-sucedida, responder com status 200 e uma mensagem
    return response.status(200).json({ 
      success: 'Ping! O servidor e o banco de dados estão online.' 
    });
  } catch (error) {
    // Se houver um erro ao conectar-se ao banco de dados, responder com status 500 e uma mensagem de erro
    console.error('Erro ao verificar o status do banco de dados:', error);
    return response.status(500).json({ 
      error: 'O servidor está online, mas ocorreu um erro ao conectar-se ao banco de dados.' 
    });
  }
});

// Iniciar o servidor na porta 3333
app.listen(3333, () => {
  console.log('Servidor rodando em http://localhost:3333');
});
