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
const client_1 = require("@prisma/client");
const webPushConfig_1 = __importDefault(require("../config/webPushConfig"));
// Interface para os dados da mensagem de push
const prisma = new client_1.PrismaClient();
// Configuração das chaves VAPID para WebPush
// const publicKey = 'BBsXYqVS8EFi29zDPFD_uFUg11oaKBowNRqk-O-WqP3cmzzQOuSyCTUGUsStGtZFKEz8f2XYEx-mDawfhCg4hAM';
// const privateKey = 'akUfQDG1egwhDbLFzg__48BYOSuV9kti4upgRKGX8KU';
// webPush.setVapidDetails('https://localhost:3333', publicKey, privateKey);
// Serviço para enviar notificações push
class PSH_SendNotificationService {
    // Método para enviar notificações push para usuários específicos
    sendNotifications(users, body) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            try {
                // Busca os usuários com as chaves de notificação
                const usersFound = yield prisma.pSH_Usuario.findMany({
                    where: {
                        PSH_UsuarioChave: {
                            in: users,
                        },
                    },
                });
                // Busca os endpoints de notificação dos usuários encontrados
                const endpointsUsers = yield prisma.pSH_UsuarioEndpoint.findMany({
                    where: {
                        PSH_UsuarioId: {
                            in: usersFound.map((user) => user.PSH_UsuarioId),
                        },
                    },
                });
                // Constrói o payload da notificação
                const notificationPayload = JSON.stringify({
                    icon: body.message.icon,
                    title: body.message.title,
                    body: body.message.body,
                    url: body.message.url,
                });
                // Verifica se há endpoints de usuário encontrados
                if (endpointsUsers.length !== 0) {
                    // Cria um registro de log de notificação
                    const logNotificacao = yield prisma.pSH_NotificacaoLog.create({
                        data: {
                            PSH_NotificacaoLogCreatedAt: new Date(),
                            PSH_NotificacaoLogBody: notificationPayload,
                            PSH_NotificacaoLogIcon: body.message.icon,
                            PSH_NotificacaoLogStatus: 'S',
                            PSH_NotificacaoLogTitle: body.message.title,
                            PSH_NotificacaoLogUpdatedAt: new Date(),
                            PSH_NotificacaoLogUrl: body.message.url,
                            TEC_AplicacaoId: body.TEC_AplicacaoId,
                            TEC_ClienteCodigo: body.TEC_ClienteCodigo,
                        },
                    });
                    // Itera sobre os endpoints de usuário para enviar notificações push
                    for (const endpointUser of endpointsUsers) {
                        try {
                            // Busca o endpoint específico
                            const endpoint = yield prisma.pSH_Endpoint.findFirst({
                                where: {
                                    PSH_EndpointId: endpointUser.PSH_EndpointId,
                                    NOT: [{ PSH_EndpointAuth: null }, { PSH_EndpointAuth: '' }],
                                },
                            });
                            // Se não houver endpoint válido, continua para o próximo
                            if (!endpoint) {
                                continue;
                            }
                            // Cria a estrutura de assinatura para enviar a notificação
                            const subscription = {
                                endpoint: endpoint.PSH_EndpointEndpoint,
                                keys: {
                                    auth: endpoint.PSH_EndpointAuth,
                                    p256dh: endpoint.PSH_EndpointP256dh,
                                },
                            };
                            // Envia a notificação push para o endpoint
                            const notificationSend = yield webPushConfig_1.default.sendNotification(subscription, notificationPayload);
                            // Verifica se a resposta da notificação indica que o usuário cancelou a inscrição
                            if (notificationSend.body.includes('unsubscribed') || notificationSend.body.includes('expired')) {
                                // Executa transação para deletar o endpoint e o relacionamento do usuário
                                yield prisma.$transaction((prismaTr) => __awaiter(this, void 0, void 0, function* () {
                                    yield prismaTr.pSH_Endpoint.delete({ where: { PSH_EndpointId: endpoint.PSH_EndpointId } });
                                    const whereUniqueInput = {
                                        PSH_EndpointId_PSH_UsuarioId: {
                                            PSH_EndpointId: endpointUser.PSH_EndpointId,
                                            PSH_UsuarioId: endpointUser.PSH_UsuarioId,
                                        },
                                    };
                                    yield prismaTr.pSH_UsuarioEndpoint.delete({ where: whereUniqueInput });
                                }));
                                // Cria um registro de log de usuário indicando a ação
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
                            // Cria um registro de log de usuário indicando sucesso
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
                            // Trata erros durante o envio da notificação
                            if ((((_a = error.body) === null || _a === void 0 ? void 0 : _a.includes('unsubscribed')) || ((_b = error.body) === null || _b === void 0 ? void 0 : _b.includes('expired'))) || ((_c = error.endpoint) === null || _c === void 0 ? void 0 : _c.includes("notify.windows")) && error.statusCode === 410) {
                                // Executa transação para deletar o endpoint e o relacionamento do usuário
                                yield prisma.$transaction((prismaTr) => __awaiter(this, void 0, void 0, function* () {
                                    yield prismaTr.pSH_Endpoint.delete({ where: { PSH_EndpointId: endpointUser.PSH_EndpointId } });
                                    const whereUniqueInput = {
                                        PSH_EndpointId_PSH_UsuarioId: {
                                            PSH_EndpointId: endpointUser.PSH_EndpointId,
                                            PSH_UsuarioId: endpointUser.PSH_UsuarioId,
                                        },
                                    };
                                    yield prismaTr.pSH_UsuarioEndpoint.delete({ where: whereUniqueInput });
                                }));
                                // Cria um registro de log de usuário indicando o erro
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
                // Trata erros durante o envio de notificações
                console.error('Erro ao enviar notificações push:', error);
            }
        });
    }
}
exports.default = PSH_SendNotificationService;
