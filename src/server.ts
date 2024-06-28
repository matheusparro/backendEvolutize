import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import * as fs from 'fs';
import * as https from 'https';
import { PrismaClient } from '@prisma/client';
import PSH_RegisterNotificationRouter from './routes/PSH_RegisterNotificationRouter';
import PSH_EndpointRouter from './routes/PSH_EndpointRouter';
import PSH_SendNotificationRouter from './routes/PSH_SendNotificationRouter';
import dotenv from 'dotenv';
import AppError from './errorException/AppError';

dotenv.config();

const prisma = new PrismaClient();
const app = express();

// Opções HTTPS
// const httpsOptions = {
//   key: fs.readFileSync('./certificados/star.evolutize.com.br.key'),
//   cert: fs.readFileSync('./certificados/star.evolutize.com.br.crt'),
//   passphrase: "9312tecno!evolutize!"
// };


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
  const vapidPublicKey = String(process.env.PUBLIC_VAPID_KEY);
  return response.status(200).json({ publicKey: vapidPublicKey });
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

app.get('/', async (request, response) => {
  return response.json({ message: 'Servidor rodando!' });
})

// Crie o servidor HTTPS e inicie-o na porta 443
// https.createServer(httpsOptions, app).listen(3443, () => {

//   console.log('Servidor rodando em https://star.evolutize.com.br:3443');
// });

// Se desejar manter um servidor HTTP para redirecionar para HTTPS
// const httpApp = express();
// httpApp.use((req, res) => {
//   console.log(`https://${req.headers.host}${req.url}`)
//   res.redirect(`https://${req.headers.host}${req.url}`);
 
// });

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled error:', err.message);
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  const code = err.code || 'INTERNAL_ERROR';
  res.status(statusCode).json({ status: 'error', statusCode, message, code });
});
app.listen(3333);