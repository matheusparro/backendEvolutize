// UsuUsuarioEndpointService.ts
import { USU_USUARIOENDPOINTDTO } from '../config/interface.models';
import { Prisma, USU_USUARIOENDPOINT } from '@prisma/client';
import { PrismaClientManager } from '../dataBase/PrismaClientManager';
import { TransactionScope } from '../shared/TransactionScope';

export default class USU_UsuarioEndpointService {
  private readonly clientManager: PrismaClientManager;
  private readonly transactionScope: TransactionScope;
  private prisma: Prisma.TransactionClient;

  constructor(transactionScope: TransactionScope, clientManager: PrismaClientManager) {
    this.clientManager = clientManager;
    this.transactionScope = transactionScope;
    this.prisma = clientManager.getClient();
  }

  async createUsuarioEndpoint(usuarioEndpoint: USU_USUARIOENDPOINTDTO): Promise<USU_USUARIOENDPOINT> {
    try {
      const prisma = this.clientManager.getClient();
      return await this.transactionScope.run(async () => {
        return await prisma.uSU_USUARIOENDPOINT.create({
          data: usuarioEndpoint,
        });
      });
    } catch (error: any) {
      console.error('Erro ao criar usuário-endpoint:', error.message);
      throw new Error(`Falha ao criar usuário-endpoint: ${error.message}`);
    }
  }

  async getAllUsuarioEndpoints(): Promise<USU_USUARIOENDPOINT[]> {
    try {
      return await this.prisma.uSU_USUARIOENDPOINT.findMany();
    } catch (error: any) {
      console.error('Erro ao buscar todos os usuários-endpoints:', error.message);
      throw new Error(`Falha ao buscar dados dos usuários-endpoints: ${error.message}`);
    }
  }

  async getUsuarioEndpointById(userId: number, endpointId: number): Promise<USU_USUARIOENDPOINT | null> {
    try {
      return await this.prisma.uSU_USUARIOENDPOINT.findUnique({
        where: { USU_UsuarioId_TEC_EndpointId: { USU_UsuarioId: userId, TEC_EndpointId: endpointId } },
      });
    } catch (error: any) {
      console.error('Erro ao buscar usuário-endpoint pelo ID:', error.message);
      throw new Error(`Falha ao buscar usuário-endpoint pelo ID: ${error.message}`);
    }
  }

  async deleteUsuarioEndpoint(userId: number, endpointId: number): Promise<USU_USUARIOENDPOINT | null> {
    try {
      return await this.prisma.uSU_USUARIOENDPOINT.delete({
        where: { USU_UsuarioId_TEC_EndpointId: { USU_UsuarioId: userId, TEC_EndpointId: endpointId } },
      });
    } catch (error: any) {
      console.error('Erro ao deletar usuário-endpoint:', error.message);
      throw new Error(`Falha ao deletar usuário-endpoint: ${error.message}`);
    }
  }
}
