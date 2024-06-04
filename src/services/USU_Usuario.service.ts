import { USU_USUARIOCANALDTO, USU_USUARIODTO, USU_USUARIODTO_ALL, USU_USUARIOENDPOINTDTO_ALL } from '../config/interface.models';
import { Prisma, TEC_ENDPOINT, USU_USUARIO } from '@prisma/client';
import { PrismaClientManager } from '../dataBase/PrismaClientManager';
import { TransactionScope } from '../shared/TransactionScope';

export default class USU_UsuarioService {
  private readonly clientManager: PrismaClientManager;
  private readonly transactionScope: TransactionScope;
  private prisma: Prisma.TransactionClient;

  constructor(transactionScope: TransactionScope, clientManager: PrismaClientManager) {
    this.clientManager = clientManager;
    this.transactionScope = transactionScope;
    this.prisma = clientManager.getClient();
  }

  async createUser(usuario: USU_USUARIODTO): Promise<USU_USUARIO> {
    try {
      let resultadoTransacao: USU_USUARIO | undefined;
      
      await this.transactionScope.run(async () => {
        const prisma = this.clientManager.getClient();
        const newUser = await prisma.uSU_USUARIO.create({
          data: usuario,
        });
  
        resultadoTransacao = newUser;
      });
  
      if (resultadoTransacao) {
        return resultadoTransacao;
      } else {
        throw new Error('Falha ao criar usuário.');
      }
    } catch (error: any) {
      console.error('Erro ao criar usuário:', error.message);
      throw new Error('Falha ao criar usuário.');
    }
  }
  
  async getAllUsers() {
    try {
      return await this.prisma.uSU_USUARIO.findMany();
    } catch (error: any) {
      console.error('Erro ao buscar todos os usuários:', error.message);
      throw new Error('Falha ao buscar dados do usuário.');
    }
  }

  async getAllUsersByCanal(tec_canaisIds: number[]): Promise<any> {
    try {
        const usersByChannel = await this.prisma.uSU_USUARIOCANAL.findMany({
            where: {
                TEC_CanalId: {
                    in: tec_canaisIds
                }
            }
        });

        const uniqueUserIds = new Set<number>();
        for (const user of usersByChannel) {
            uniqueUserIds.add(user.USU_UsuarioId);
        }

        const endpoints: any[] = [];
        for (const userId of uniqueUserIds) {
            const endpointsByUsers = await this.prisma.uSU_USUARIOENDPOINT.findMany({
                where: {
                    USU_UsuarioId: userId
                },
                include: {
                    TEC_Endpoint: true
                }
            });

            for (const endpoint of endpointsByUsers) {
                endpoints.push({ USU_UsuarioId: userId, ...endpoint.TEC_Endpoint });
            }
        }

        if (endpoints.length > 0) {
            return endpoints;
        }
        return null;
    } catch (error: any) {
        console.error('Erro ao buscar todos os usuários:', error.message);
        throw new Error('Falha ao buscar dados do usuário.');
    }
}

  async getUserById(id: number) {
    try {
      return await this.prisma.uSU_USUARIO.findUnique({
        where: { USU_UsuarioId: id },
      });
    } catch (error: any) {
      console.error('Erro ao buscar usuário por ID:', error.message);
      throw new Error('Falha ao buscar usuário por ID.');
    }
  }

  async getUserByChvAcesso(userChv: string, tec_baseaplicacaoId: number, tec_parametroCodigoCliente: number) {
    try {
      return await this.prisma.uSU_USUARIO.findFirst({
        where: { USU_UsuarioChave: userChv, TEC_BaseAplicacaoId: Number(tec_baseaplicacaoId), TEC_ParametroCodigoCliente: Number(tec_parametroCodigoCliente) },
      });
    } catch (error: any) {
      console.error('Erro ao buscar usuário por ID:', error.message);
      throw new Error('Falha ao buscar usuário por ID.');
    }
  }

  async updateUser(id: number, novoUsuario: Partial<USU_USUARIO>) {
    try {
      return await this.prisma.uSU_USUARIO.update({
        where: { USU_UsuarioId: id },
        data: novoUsuario,
      });
    } catch (error: any) {
      console.error('Erro ao atualizar usuário:', error.message);
      throw new Error('Falha ao atualizar usuário.');
    }
  }

  async deleteUser(id: number) {
    try {
      return await this.prisma.uSU_USUARIO.delete({
        where: { USU_UsuarioId: id },
      });
    } catch (error: any) {
      console.error('Erro ao excluir usuário:', error.message);
      throw new Error('Falha ao excluir usuário.');
    }
  }
}
