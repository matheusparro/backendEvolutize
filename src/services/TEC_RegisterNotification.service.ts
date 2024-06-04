import { TEC_ENDPOINTDTO, USU_USUARIODTO } from '../config/interface.models';
import { Prisma } from '@prisma/client';
import { PrismaClientManager } from '../dataBase/PrismaClientManager';
import { TransactionScope } from '../shared/TransactionScope';
import { ISubscription } from '../server';
import USU_UsuarioService from './USU_Usuario.service';
import TEC_EndpointService from './TEC_Endpoint.service';
import USU_UsuarioEndpointService from './USU_UsuarioEndpoint.service';

export default class TEC_RegisterNotification {
    private readonly clientManager: PrismaClientManager;
    private readonly transactionScope: TransactionScope;
    private usu_usuarioService: USU_UsuarioService;
    private tec_endpointService: TEC_EndpointService;
    private usu_usuarioEndpointService: USU_UsuarioEndpointService;
    
    constructor(
        transactionScope: TransactionScope,
        clientManager: PrismaClientManager,
        usu_usuarioService: USU_UsuarioService,
        tec_endpointService: TEC_EndpointService,
        usu_usuarioEndpointService: USU_UsuarioEndpointService
    ) {
        this.clientManager = clientManager;
        this.transactionScope = transactionScope;
        this.usu_usuarioService = usu_usuarioService;
        this.tec_endpointService = tec_endpointService;
        this.usu_usuarioEndpointService = usu_usuarioEndpointService;
    }

    async register(subscription: ISubscription, usu_usuario: USU_USUARIODTO): Promise<void> {
        try {
            await this.transactionScope.run(async () => {
                let newUser = await this.usu_usuarioService.getUserByChvAcesso(usu_usuario.USU_UsuarioChave, usu_usuario.TEC_BaseAplicacaoId, usu_usuario.TEC_ParametroCodigoCliente);
                if (!newUser) {
                    newUser = await this.usu_usuarioService.createUser({
                        USU_UsuarioTipo: usu_usuario.USU_UsuarioTipo,
                        USU_UsuarioNome: usu_usuario.USU_UsuarioNome,
                        USU_UsuarioChave: usu_usuario.USU_UsuarioChave,
                        TEC_ParametroCodigoCliente: usu_usuario.TEC_ParametroCodigoCliente,
                        TEC_BaseAplicacaoId: usu_usuario.TEC_BaseAplicacaoId,
                    });
                }
                
                let newEndpoint = await this.tec_endpointService.getEndpointByEndpoint(subscription.endpoint);
                if (!newEndpoint) {
                    newEndpoint = await this.tec_endpointService.createEndpoint({
                        TEC_EndpointAuth: subscription.keys.auth,
                        TEC_EndpointEndpoint: subscription.endpoint,
                        TEC_EndpointName: newUser.USU_UsuarioNome, 
                        TEC_EndpointP256dh: subscription.keys.p256dh
                    });
                }

                const userEndpointExists = await this.usu_usuarioEndpointService.getUsuarioEndpointById(newUser.USU_UsuarioId, newEndpoint.TEC_EndpointId);
                if (!userEndpointExists) {
                    await this.usu_usuarioEndpointService.createUsuarioEndpoint({
                        USU_UsuarioId: newUser.USU_UsuarioId,
                        TEC_EndpointId: newEndpoint.TEC_EndpointId
                    });
                }
            });
        } catch (error: any) {
            console.error('Erro ao criar endpoint:', error.message);
            throw new Error('Falha ao criar endpoint.');
        }
    }
}
