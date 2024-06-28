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
const web_push_1 = __importDefault(require("web-push"));
const client_1 = require("@prisma/client");
const PSH_RegisterNotificationRouter_1 = __importDefault(require("./routes/PSH_RegisterNotificationRouter"));
const PSH_EndpointRouter_1 = __importDefault(require("./routes/PSH_EndpointRouter"));
const prisma = new client_1.PrismaClient();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
// WebPush
const publicKey = 'BBsXYqVS8EFi29zDPFD_uFUg11oaKBowNRqk-O-WqP3cmzzQOuSyCTUGUsStGtZFKEz8f2XYEx-mDawfhCg4hAM';
const privateKey = 'akUfQDG1egwhDbLFzg__48BYOSuV9kti4upgRKGX8KU';
//webPush.setVapidDetails('https://backendevolutize.onrender.com', publicKey, privateKey);
web_push_1.default.setVapidDetails('https://localhost:3333', publicKey, privateKey);
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
app.get('/notification/push/public_key', (request, response) => {
    return response.json({ publicKey });
});
app.get('/', (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const teste = yield prisma.uSU_Usuario.findMany();
    //retornar o teste em formato de json com status 200
    return response.status(200).json(teste);
    //
}));
// let logNotificacao = await prisma.pSH_NotificacaoLog.create({
//   data: {
//     PSH_NotificacaoLogCreatedAt: new Date(),
//   PSH_NotificacaoLogBody: notificationPayload,
//   PSH_NotificacaoLogIcon: body.message.icon,
//   PSH_NotificacaoLogStatus: 'S',
//   PSH_NotificacaoLogTitle: body.message.title,
//   PSH_NotificacaoLogUpdatedAt: new Date(),
//   PSH_NotificacaoLogUrl: body.message.url,
//   TEC_AplicacaoId: body.TEC_AplicacaoId,
//   TEC_ClienteCodigo : body.TEC_ClienteCodigo
//   },  
// });
// create a method tthat do this and return log
function sendNotifications(users, body) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        try {
            const usersFound = yield prisma.pSH_Usuario.findMany({
                where: {
                    PSH_UsuarioChave: {
                        in: users,
                    },
                },
            });
            const endpointsUsers = yield prisma.pSH_UsuarioEndpoint.findMany({
                where: {
                    PSH_UsuarioId: {
                        in: usersFound.map(user => user.PSH_UsuarioId),
                    },
                },
            });
            const notificationPayload = JSON.stringify({
                icon: body.message.icon,
                title: body.message.title,
                body: body.message.body,
                url: body.message.url,
            });
            if (endpointsUsers.length != 0) {
                let logNotificacao = yield prisma.pSH_NotificacaoLog.create({
                    data: {
                        PSH_NotificacaoLogCreatedAt: new Date(),
                        PSH_NotificacaoLogBody: notificationPayload,
                        PSH_NotificacaoLogIcon: body.message.icon,
                        PSH_NotificacaoLogStatus: 'S',
                        PSH_NotificacaoLogTitle: body.message.title,
                        PSH_NotificacaoLogUpdatedAt: new Date(),
                        PSH_NotificacaoLogUrl: body.message.url,
                        TEC_AplicacaoId: body.TEC_AplicacaoId,
                        TEC_ClienteCodigo: body.TEC_ClienteCodigo
                    },
                });
                for (const endpointUser of endpointsUsers) {
                    try {
                        const endpoint = yield prisma.pSH_Endpoint.findFirst({
                            where: {
                                PSH_EndpointId: endpointUser.PSH_EndpointId,
                                NOT: [
                                    { PSH_EndpointAuth: null },
                                    { PSH_EndpointAuth: "" },
                                ],
                            },
                        });
                        if (!endpoint) {
                            continue;
                        }
                        const subscription = {
                            endpoint: endpoint.PSH_EndpointEndpoint,
                            keys: {
                                auth: endpoint.PSH_EndpointAuth,
                                p256dh: endpoint.PSH_EndpointP256dh,
                            },
                        };
                        const notificationSend = yield web_push_1.default.sendNotification(subscription, notificationPayload);
                        if (notificationSend.body.includes('unsubscribed') || notificationSend.body.includes('expired')) {
                            yield prisma.$transaction((prismaTr) => __awaiter(this, void 0, void 0, function* () {
                                yield prismaTr.pSH_Endpoint.delete({ where: { PSH_EndpointId: endpoint.PSH_EndpointId } });
                                const whereUniqueInput = {
                                    PSH_EndpointId_PSH_UsuarioId: {
                                        PSH_EndpointId: endpointUser.PSH_EndpointId,
                                        PSH_UsuarioId: endpointUser.PSH_UsuarioId,
                                    },
                                };
                                yield prismaTr.pSH_UsuarioEndpoint.delete({
                                    where: whereUniqueInput,
                                });
                            }));
                            yield prisma.pSH_NotificacaoLogUsuario.create({
                                data: {
                                    PSH_NotificacaoLogId: logNotificacao.PSH_NotificacaoLogId,
                                    PSH_NotificacaoLogUsuarioMensa: 'Usuário cancelou a inscrição na notificação no navegador',
                                    PSH_NotificacaoLogUsuarioStatu: 'E',
                                    PSH_NotificacaoLogUsuarioId: endpointUser.PSH_UsuarioId,
                                    PSH_NotificacaoLogUsuarioCreat: new Date(),
                                },
                            });
                        }
                        yield prisma.pSH_NotificacaoLogUsuario.create({
                            data: {
                                PSH_NotificacaoLogId: logNotificacao.PSH_NotificacaoLogId,
                                PSH_NotificacaoLogUsuarioMensa: 'Notificação Enviada com Sucesso',
                                PSH_NotificacaoLogUsuarioStatu: 'S',
                                PSH_NotificacaoLogUsuarioId: endpointUser.PSH_UsuarioId,
                                PSH_NotificacaoLogUsuarioCreat: new Date(),
                            },
                        });
                    }
                    catch (error) {
                        if (((_a = error.body) === null || _a === void 0 ? void 0 : _a.includes("unsubscribed")) || ((_b = error.body) === null || _b === void 0 ? void 0 : _b.includes("expired"))) {
                            yield prisma.pSH_Endpoint.delete({ where: { PSH_EndpointId: endpointUser.PSH_EndpointId } });
                            const whereUniqueInput = {
                                PSH_EndpointId_PSH_UsuarioId: {
                                    PSH_EndpointId: endpointUser.PSH_EndpointId,
                                    PSH_UsuarioId: endpointUser.PSH_UsuarioId,
                                },
                            };
                            yield prisma.pSH_UsuarioEndpoint.delete({
                                where: whereUniqueInput,
                            });
                            // Crie um registro de log de usuário para indicar que houve um erro ao enviar a notificação push
                            yield prisma.pSH_NotificacaoLogUsuario.create({
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
        }
        catch (error) {
            console.error("Erro ao enviar notificações push:", error);
        }
    });
}
app.post('/notification/push/send', (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { users, TEC_ClienteCodigo, TEC_AplicacaoId, message } = request.body;
    // Validação dos parâmetros da requisição
    if (!users || !TEC_ClienteCodigo || !TEC_AplicacaoId || !message) {
        return response.status(400).json({ error: 'Todos os parâmetros são obrigatórios: users, TEC_ClienteCodigo, TEC_AplicacaoId, message' });
    }
    // Dispara o processamento em background
    sendNotifications(users, request.body).catch((error) => {
        console.error("Erro ao processar notificações em background:", error);
    });
    // Retorna a resposta imediatamente
    return response.sendStatus(200);
}));
app.use(PSH_RegisterNotificationRouter_1.default);
app.use(PSH_EndpointRouter_1.default);
// Rota para verificar se o servidor e o banco de dados estão online
app.get('/ping', (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Testar uma consulta simples ao banco de dados
        yield prisma.$connect();
        // Se a consulta for bem-sucedida, responder com status 200 e uma mensagem
        return response.status(200).json({
            sucess: 'Ping! O servidor e o banco de dados estão online.'
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
app.listen(3333);
