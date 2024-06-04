// UsuUsuarioCanalService.ts
import { TEC_CANALDTO, USU_USUARIOCANALDTO, USU_USUARIOCANAL_ALLDTO, USU_USUARIODTO } from '../config/interface.models';
import { Prisma, TEC_CANAL, USU_USUARIO, USU_USUARIOCANAL } from '@prisma/client';
import { PrismaClientManager } from '../dataBase/PrismaClientManager';
import { TransactionScope } from '../shared/TransactionScope';

export default class USU_UsuarioCanalService {
  private readonly clientManager: PrismaClientManager;
  private readonly transactionScope: TransactionScope;
  private prisma: Prisma.TransactionClient;

  constructor(transactionScope: TransactionScope, clientManager: PrismaClientManager) {
    this.clientManager = clientManager;
    this.transactionScope = transactionScope;
    this.prisma = clientManager.getClient();
  }

  async createUsuarioCanal(usuarioCanal: USU_USUARIOCANALDTO): Promise<USU_USUARIOCANAL> {
    try {
      return await this.prisma.uSU_USUARIOCANAL.create({
        data: usuarioCanal,
      });
    } catch (error: any) {
      console.error('Erro ao criar usuário-canal:', error.message);
      throw new Error(`Falha ao criar usuário-canal: ${error.message}`);
    }
  }

  async createUsuarioCanalAll(tec_canais: number[], usu_usuarioId: number): Promise<void> {
    try {
      const prisma = this.clientManager.getClient();
      await prisma.uSU_USUARIOCANAL.deleteMany({ where: { USU_UsuarioId: usu_usuarioId } });
      if (tec_canais.length > 0) {
        for (const canal of tec_canais) {
          await prisma.uSU_USUARIOCANAL.create({
            data: { USU_UsuarioId: Number(usu_usuarioId), TEC_CanalId: Number(canal) },
          });
        }
      }
    } catch (error: any) {
      console.error('Erro ao criar todos os usuários-canais:', error.message);
      throw new Error(`Falha ao criar todos os usuários-canais: ${error.message}`);
    }
  }

  async getAllCanaisByUsuarioChv(usu_usuario: USU_USUARIODTO): Promise<TEC_CANAL[]> {
    if (!usu_usuario.USU_UsuarioChave) {
      throw new Error("USU_UsuarioChave não pode ser undefined");
    }
  
    try {
      const usuarioCanais = await this.prisma.uSU_USUARIOCANAL.findMany({
        where: {
          USU_Usuario: {
            USU_UsuarioChave: usu_usuario.USU_UsuarioChave,
            TEC_BaseAplicacaoId: usu_usuario.TEC_BaseAplicacaoId,
            TEC_ParametroCodigoCliente: usu_usuario.TEC_ParametroCodigoCliente
          }
        },
        include: {
          TEC_Canal: true
        }
      });
  
      const canais = usuarioCanais.map(usuarioCanal => usuarioCanal.TEC_Canal);
      return canais;
    } catch (error: any) {
      console.error('Erro ao buscar todos os canais do usuário:', error.message);
      throw new Error(`Falha ao buscar os dados do canal do usuário: ${error.message}`);
    }
  }
  

  async getAllUsuarioCanalByCanal(TEC_CanalId: number): Promise<USU_USUARIOCANAL_ALLDTO[]> {
    try {
      return await this.prisma.uSU_USUARIOCANAL.findMany({
        where: { TEC_CanalId },
        include: { USU_Usuario: true, TEC_Canal: true }
      });
    } catch (error: any) {
      console.error('Erro ao buscar todos os usuários-canais:', error.message);
      throw new Error(`Falha ao buscar dados dos usuários-canais: ${error.message}`);
    }
  }

  async getUsuarioCanalById(userId: number, channelId: number): Promise<USU_USUARIOCANAL | null> {
    try {
      return await this.prisma.uSU_USUARIOCANAL.findUnique({
        where: { USU_UsuarioId_TEC_CanalId: { USU_UsuarioId: userId, TEC_CanalId: channelId } },
      });
    } catch (error: any) {
      console.error('Erro ao buscar usuário-canal pelo ID:', error.message);
      throw new Error(`Falha ao buscar usuário-canal pelo ID: ${error.message}`);
    }
  }

  async deleteUsuarioCanal(userId: number, channelId: number): Promise<USU_USUARIOCANAL | null> {
    try {
      return await this.prisma.uSU_USUARIOCANAL.delete({
        where: { USU_UsuarioId_TEC_CanalId: { USU_UsuarioId: userId, TEC_CanalId: channelId } },
      });
    } catch (error: any) {
      console.error('Erro ao deletar usuário-canal:', error.message);
      throw new Error(`Falha ao deletar usuário-canal: ${error.message}`);
    }
  }
}
