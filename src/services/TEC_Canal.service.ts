import { Prisma, TEC_CANAL } from '@prisma/client';
import { TEC_CANALDTO } from '../config/interface.models';
import { PrismaClientManager } from '../dataBase/PrismaClientManager';
import { TransactionScope } from '../shared/TransactionScope';
import TEC_ParametroBaseAplicacaoService from './TEC_ParametroBaseAplicacao.service';

export interface CanalQueryParams {
  [key: string]: string | number | undefined;
  TEC_CanalNome?: string;
  TEC_ParametroCodigoCliente?: number;
  TEC_BaseAplicacaoId?: number;
  // Adicione outros campos conforme necessário
}

export default class TEC_CanalService {
  private readonly clientManager: PrismaClientManager;
  private readonly transactionScope: TransactionScope;
  private prisma: Prisma.TransactionClient;

  constructor(transactionScope: TransactionScope, clientManager: PrismaClientManager) {
    this.clientManager = clientManager;
    this.transactionScope = transactionScope;
    this.prisma = clientManager.getClient();
  }

  async createCanal(TEC_Canal: TEC_CANALDTO): Promise<TEC_CANAL> {
    try {
      const { TEC_ParametroCodigoCliente, TEC_BaseAplicacaoId } = TEC_Canal;

      // Verificar se TEC_ParametroCodigoCliente está cadastrado
      const parametroClienteExists = await new TEC_ParametroBaseAplicacaoService(this.transactionScope, this.clientManager).getById(TEC_ParametroCodigoCliente, TEC_BaseAplicacaoId);
      if (!parametroClienteExists) {
        throw new Error("A aplicação e Parametro Codigo do Cliente não possui vínculo, ou não existem na integração, por favor sincronize os dados (aplicações e parametros)");
      }

      // Criar o canal
      const canalCriado = await this.prisma.tEC_CANAL.create({
        data: {
          TEC_CanalNome: TEC_Canal.TEC_CanalNome,
          TEC_ParametroCodigoCliente: TEC_Canal.TEC_ParametroCodigoCliente,
          TEC_BaseAplicacaoId: TEC_Canal.TEC_BaseAplicacaoId,
        },
      });

      return canalCriado;
    } catch (error: any) {
      throw new Error(`Erro ao criar canal: ${error.message}`);
    }
  }

  async getAllCanais(queryParams: CanalQueryParams) {
    try {
      let where = {}; // Inicializa os filtros como vazio

      // Verifica se há parâmetros de consulta presentes
      if (Object.keys(queryParams).length > 0) {
        // Loop através de cada parâmetro de consulta e adicione-os como filtro
        Object.keys(queryParams).forEach(key => {
          // Adiciona cada parâmetro de consulta como um filtro
          if (key === 'TEC_CanalNome') {
            where = {
              ...where,
              [key]: {
                mode: 'insensitive',
                contains: queryParams[key] // Usa 'contains' para simular o operador 'like'
              }
            };
          } else {
            where = {
              ...where,
              [key]: Number(queryParams[key])
            };
          }
        });
      }

      // Obtem todos os canais com base nos filtros
      const canais = await this.prisma.tEC_CANAL.findMany({
        where: where
      });

      return canais;
    } catch (error: any) {
      console.error("Erro ao buscar todos os canais:", error);
      throw new Error("Erro ao buscar todos os canais.");
    }
  }

  async getCanalById(id: number) {
    try {
      return await this.prisma.tEC_CANAL.findUnique({
        where: { TEC_CanalId: id },
      });
    } catch (error: any) {
      throw new Error(`Erro ao obter canal por ID: ${error.message}`);
    }
  }

  async updateCanal(id: number, novoCanal: Partial<TEC_CANAL>) {
    try {
      return await this.prisma.tEC_CANAL.update({
        where: { TEC_CanalId: id },
        data: {
          TEC_CanalNome: novoCanal.TEC_CanalNome,
          TEC_ParametroCodigoCliente: novoCanal.TEC_ParametroCodigoCliente,
          TEC_BaseAplicacaoId: novoCanal.TEC_BaseAplicacaoId,
        },
      });
    } catch (error: any) {
      throw new Error(`Erro ao atualizar canal: ${error.message}`);
    }
  }

  async deleteCanal(id: number) {
    try {
      return await this.prisma.tEC_CANAL.delete({
        where: { TEC_CanalId: id },
      });
    } catch (error: any) {
      throw new Error(`Erro ao excluir canal: ${error.message}`);
    }
  }
}
