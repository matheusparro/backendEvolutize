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
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
class PSH_RegisterNotificationService {
    register(subscription, psh_usuario) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const prismaClient = new client_1.PrismaClient();
                yield prismaClient.$transaction((prisma) => __awaiter(this, void 0, void 0, function* () {
                    const clienteAplicacao = yield prisma.tEC_ClienteAplicacao.findFirst({
                        where: {
                            TEC_ClienteCodigo: psh_usuario.TEC_ClienteCodigo,
                            TEC_AplicacaoId: psh_usuario.TEC_AplicacaoID,
                        }
                    });
                    if (!clienteAplicacao) {
                        throw new Error('Cliente/Aplicação não encontrados.');
                    }
                    let newUser = yield prisma.pSH_Usuario.findFirst({
                        where: {
                            PSH_UsuarioChave: psh_usuario.PSH_UsuarioChave,
                        }
                    });
                    if (!newUser) {
                        newUser = yield prisma.pSH_Usuario.create({
                            data: {
                                PSH_UsuarioNome: psh_usuario.PSH_UsuarioNome,
                                PSH_UsuarioChave: psh_usuario.PSH_UsuarioChave,
                                TEC_ClienteCodigo: psh_usuario.TEC_ClienteCodigo,
                                TEC_AplicacaoId: psh_usuario.TEC_AplicacaoID,
                                PSH_UsuarioTipo: psh_usuario.PSH_UsuarioTipo,
                                PSH_UsuarioCreatedAt: new Date(),
                                PSH_UsuarioUpdatedAt: new Date(),
                            }
                        });
                    }
                    if (subscription) {
                        const findEndpointToDelete = yield prisma.pSH_Endpoint.findFirst({
                            where: {
                                PSH_EndpointAuth: '',
                                PSH_EndpointP256dh: '',
                            }
                        });
                        if (findEndpointToDelete) {
                            yield prisma.pSH_Endpoint.delete({
                                where: {
                                    PSH_EndpointId: findEndpointToDelete.PSH_EndpointId,
                                }
                            });
                            const usuarioEndpointFound = yield prisma.pSH_UsuarioEndpoint.findFirst({
                                where: {
                                    PSH_UsuarioId: newUser.PSH_UsuarioId,
                                    PSH_EndpointId: findEndpointToDelete.PSH_EndpointId,
                                }
                            });
                            if (usuarioEndpointFound) {
                                const whereUniqueInput = {
                                    PSH_EndpointId_PSH_UsuarioId: {
                                        PSH_EndpointId: findEndpointToDelete.PSH_EndpointId,
                                        PSH_UsuarioId: newUser.PSH_UsuarioId,
                                    }
                                };
                                yield prisma.pSH_UsuarioEndpoint.delete({
                                    where: whereUniqueInput,
                                });
                            }
                        }
                        const findEndpoint = yield prisma.pSH_Endpoint.findFirst({
                            where: {
                                PSH_EndpointEndpoint: subscription.endpoint,
                            }
                        });
                        if (!findEndpoint) {
                            const endpointCreated = yield prisma.pSH_Endpoint.create({
                                data: {
                                    PSH_EndpointP256dh: subscription.keys.p256dh,
                                    PSH_EndpointEndpoint: subscription.endpoint,
                                    PSH_EndpointAuth: subscription.keys.auth,
                                    PSH_EndpointCreatedAt: new Date(),
                                    PSH_EndpointUpdatedAt: new Date(),
                                    PSH_EndpointUltimoLogin: new Date(),
                                }
                            });
                            if (!endpointCreated) {
                                throw new Error('Falha ao criar endpoint.');
                            }
                            const usuarioEndpoint = yield prisma.pSH_UsuarioEndpoint.create({
                                data: {
                                    PSH_UsuarioId: newUser.PSH_UsuarioId,
                                    PSH_EndpointId: endpointCreated.PSH_EndpointId,
                                    PSH_UsuarioEndpointCreatedAt: new Date(),
                                    PSH_UsuarioEndpointUpdatedAt: new Date(),
                                }
                            });
                            if (!usuarioEndpoint) {
                                throw new Error('Falha ao criar endpoint.');
                            }
                        }
                    }
                    else {
                        const findAllEndpoints = yield prisma.pSH_UsuarioEndpoint.findMany({
                            where: {
                                PSH_UsuarioId: newUser.PSH_UsuarioId,
                            }
                        });
                        let pshEndpointDenied = null;
                        findAllEndpoints.forEach((endpoint) => __awaiter(this, void 0, void 0, function* () {
                            pshEndpointDenied = yield prisma.pSH_Endpoint.findFirst({
                                where: {
                                    PSH_EndpointId: endpoint.PSH_EndpointId,
                                    PSH_EndpointAuth: '',
                                    PSH_EndpointP256dh: '',
                                }
                            });
                        }));
                        if (!pshEndpointDenied) {
                            const endpointCreated = yield prisma.pSH_Endpoint.create({
                                data: {
                                    PSH_EndpointP256dh: '',
                                    PSH_EndpointEndpoint: '',
                                    PSH_EndpointAuth: '',
                                    PSH_EndpointCreatedAt: new Date(),
                                    PSH_EndpointUpdatedAt: new Date(),
                                    PSH_EndpointUltimoLogin: new Date(),
                                }
                            });
                            if (!endpointCreated) {
                                throw new Error('Falha ao criar endpoint.');
                            }
                            const usuarioEndpoint = yield prisma.pSH_UsuarioEndpoint.create({
                                data: {
                                    PSH_UsuarioId: newUser.PSH_UsuarioId,
                                    PSH_EndpointId: endpointCreated.PSH_EndpointId,
                                    PSH_UsuarioEndpointCreatedAt: new Date(),
                                    PSH_UsuarioEndpointUpdatedAt: new Date(),
                                }
                            });
                            if (!usuarioEndpoint) {
                                throw new Error('Falha ao criar endpoint.');
                            }
                        }
                    }
                }));
            }
            catch (error) {
                throw new Error(`Falha ao criar registrar usuário: ${error.message}`);
            }
        });
    }
}
exports.default = PSH_RegisterNotificationService;
