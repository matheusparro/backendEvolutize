import TEC_ParametroService from './TEC_Parametro.service';
import TEC_BaseAplicacaoService from './TEC_BaseAplicacao.service';
import TEC_ParametroBaseAplicacaoService from './TEC_ParametroBaseAplicacao.service';
import { PrismaTransactionScope } from '../dataBase/PrismaTransactionScope';
import { PrismaClientManager } from '../dataBase/PrismaClientManager';

export default class TEC_NotificationSync {
  constructor(
    private readonly transactionScope: PrismaTransactionScope,
    private readonly clientManager: PrismaClientManager,
    private readonly tec_baseaplicacaoService: TEC_BaseAplicacaoService,
    private readonly tec_parametroService: TEC_ParametroService,
    private readonly tec_parametrobaseaplicacaoService: TEC_ParametroBaseAplicacaoService
  ) {
    this.transactionScope = transactionScope;
    this.clientManager = clientManager;
    this.tec_baseaplicacaoService = tec_baseaplicacaoService;
    this.tec_parametroService = tec_parametroService;
    this.tec_parametrobaseaplicacaoService = tec_parametrobaseaplicacaoService;
  }

  async syncAll(TEC_BaseAplicacaoAll: any, TEC_ParametroAll: any, TEC_ParametroBaseAplicacaoAll: any, firstSync: boolean, lastSync: boolean): Promise<void> {
    try {
      await this.transactionScope.run(async () => {
        await this.tec_baseaplicacaoService.sync(TEC_BaseAplicacaoAll, firstSync, lastSync);
        await this.tec_parametroService.sync(TEC_ParametroAll, firstSync, lastSync);
        await this.tec_parametrobaseaplicacaoService.sync(TEC_ParametroBaseAplicacaoAll);
      });
    } catch (error: any) {
      console.error('Erro durante a sincronização das notificações:', error);
      throw new Error('Falha ao sincronizar as notificações.');
    }
  }
}
