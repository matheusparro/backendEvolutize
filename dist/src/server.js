"use strict";
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
const client_1 = require("@prisma/client");
const PSH_RegisterNotificationRouter_1 = __importDefault(require("./routes/PSH_RegisterNotificationRouter"));
const PSH_EndpointRouter_1 = __importDefault(require("./routes/PSH_EndpointRouter"));
const PSH_SendNotificationRouter_1 = __importDefault(require("./routes/PSH_SendNotificationRouter"));
const prisma = new client_1.PrismaClient();
const app = (0, express_1.default)();
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
// Iniciar o servidor na porta 3333
app.listen(3333, () => {
    console.log('Servidor rodando em http://localhost:3333');
});
