"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const fs = __importStar(require("fs"));
const https = __importStar(require("https"));
const client_1 = require("@prisma/client");
const PSH_RegisterNotificationRouter_1 = __importDefault(require("./routes/PSH_RegisterNotificationRouter"));
const PSH_EndpointRouter_1 = __importDefault(require("./routes/PSH_EndpointRouter"));
const PSH_SendNotificationRouter_1 = __importDefault(require("./routes/PSH_SendNotificationRouter"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const prisma = new client_1.PrismaClient();
const app = (0, express_1.default)();
// Opções HTTPS
const httpsOptions = {
    key: fs.readFileSync('./certificados/star.evolutize.com.br.key'),
    cert: fs.readFileSync('./certificados/star.evolutize.com.br.crt')
};
app.use(express_1.default.json());
app.use((0, cors_1.default)());
// Middleware para verificar o status do servidor e do banco de dados
const checkServerStatusMiddleware = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Testar uma consulta simples ao banco de dados
        yield prisma.$connect();
        // Se a consulta for bem-sucedida, chamar o próximo middleware ou rota
        next();
    }
    catch (error) {
        // Se houver um erro ao conectar-se ao banco de dados, responder com status 500 e uma mensagem de erro
        console.error('Erro ao verificar o status do banco de dados:', error);
        return response.status(500).json({
            error: 'O servidor está online, mas ocorreu um erro ao conectar-se ao banco de dados.'
        });
    }
});
// Aplicar o middleware a todas as solicitações
app.use(checkServerStatusMiddleware);
// Rota para obter a chave pública do WebPush
app.get('/notification/push/public_key', (request, response) => {
    const vapidPublicKey = String(process.env.PUBLIC_VAPID_KEY);
    return response.status(200).json({ publicKey: vapidPublicKey });
});
app.use(PSH_RegisterNotificationRouter_1.default);
app.use(PSH_EndpointRouter_1.default);
app.use(PSH_SendNotificationRouter_1.default);
// Rota de ping para verificar status do servidor
app.get('/ping', (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Testar uma consulta simples ao banco de dados
        yield prisma.$connect();
        // Se a consulta for bem-sucedida, responder com status 200 e uma mensagem
        return response.status(200).json({
            success: 'Ping! O servidor e o banco de dados estão online.'
        });
    }
    catch (error) {
        // Se houver um erro ao conectar-se ao banco de dados, responder com status 500 e uma mensagem de erro
        console.error('Erro ao verificar o status do banco de dados:', error);
        return response.status(500).json({
            error: 'O servidor está online, mas ocorreu um erro ao conectar-se ao banco de dados.'
        });
    }
}));
// Crie o servidor HTTPS e inicie-o na porta 443
https.createServer(httpsOptions, app).listen(443, () => {
    console.log('Servidor rodando em https://star.evolutize.com.br:443');
});
// Se desejar manter um servidor HTTP para redirecionar para HTTPS
const httpApp = (0, express_1.default)();
httpApp.use((req, res) => {
    res.redirect(`https://${req.headers.host}${req.url}`);
});
httpApp.listen(80, () => {
    console.log('Redirecionando todas as requisições HTTP para HTTPS');
});
