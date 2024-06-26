import { PSH_USUARIODTO } from '../config/interface.models';
import { PrismaClient } from '@prisma/client';
import { ISubscription } from '../server';


export default class PSH_RegisterNotificationService {

    async register(subscription: ISubscription, psh_usuario: PSH_USUARIODTO): Promise<void> {
        try {
            const prismaClient = new PrismaClient();
            await prismaClient.$transaction(async (prisma) => {
                const clienteAplicacao = await prisma.tEC_ClienteAplicacao.findFirst({
                    where: {
                        TEC_ClienteCodigo: psh_usuario.TEC_ClienteCodigo,
                        TEC_AplicacaoId: psh_usuario.TEC_AplicacaoID,
                    }
                });
                if(!clienteAplicacao){
                    throw new Error('Cliente/Aplicação não encontrados.');
                }
                let newUser = await prisma.pSH_Usuario.findFirst({
                    where: {
                        PSH_UsuarioChave: psh_usuario.PSH_UsuarioChave,
                    }
                });
    
                if (!newUser) {
                     newUser = await prisma.pSH_Usuario.create({
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
                    const findEndpointToDelete = await prisma.pSH_Endpoint.findFirst({
                        where: {
                            PSH_EndpointAuth: '',
                            PSH_EndpointP256dh: '',
                        }
                    });
                    if(findEndpointToDelete){
                        await prisma.pSH_Endpoint.delete({
                            where: {
                                PSH_EndpointId: findEndpointToDelete.PSH_EndpointId,
                            }
                        })
                        const usuarioEndpointFound = await prisma.pSH_UsuarioEndpoint.findFirst({
                            where: {
                                PSH_UsuarioId: newUser.PSH_UsuarioId,
                                PSH_EndpointId: findEndpointToDelete.PSH_EndpointId,
                            }
                        
                        })
                        if(usuarioEndpointFound){
                            const whereUniqueInput = {
                                PSH_EndpointId_PSH_UsuarioId: {
                                    PSH_EndpointId: findEndpointToDelete.PSH_EndpointId,
                                    PSH_UsuarioId: newUser.PSH_UsuarioId,
                                }
                            };
                            await prisma.pSH_UsuarioEndpoint.delete({
                                where: whereUniqueInput,
                            })
                        }

                    }
                    const findEndpoint = await prisma.pSH_Endpoint.findFirst({
                        where: {
                            PSH_EndpointEndpoint: subscription.endpoint,
                        }
                    });
    
                    if (!findEndpoint) {
                        const endpointCreated = await prisma.pSH_Endpoint.create({
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
    
                        const usuarioEndpoint = await prisma.pSH_UsuarioEndpoint.create({
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
                } else {
                    const findAllEndpoints = await prisma.pSH_UsuarioEndpoint.findMany({
                        where: {
                            PSH_UsuarioId: newUser.PSH_UsuarioId,
                        }
                    });
                    let pshEndpointDenied = null;
                    findAllEndpoints.forEach(async (endpoint) => {
                        pshEndpointDenied = await prisma.pSH_Endpoint.findFirst({
                            where: {
                                PSH_EndpointId: endpoint.PSH_EndpointId,
                                PSH_EndpointAuth: '',
                                PSH_EndpointP256dh: '',
                            }
                        });
                    });
    
                    if (!pshEndpointDenied) {
                        const endpointCreated = await prisma.pSH_Endpoint.create({
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
    
                        const usuarioEndpoint = await prisma.pSH_UsuarioEndpoint.create({
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
            });
        } catch (error: any) {
            throw new Error(`Falha ao criar registrar usuário: ${error.message}`);
        }
    }
    
}
