import { Request, Response } from 'express';
import TEC_EndpointService from '../services/TEC_Endpoint.service';
import { clientManager, transactionScope } from '../config/transactions';

export default class TEC_EndpointController {
  private readonly endpointService: TEC_EndpointService;

  constructor(endpointService: TEC_EndpointService) {
    this.endpointService = endpointService;
  }

  public async updateLastLogin(req: Request, res: Response): Promise<Response> {
    try {
      const { tec_endpointendpoint } = req.body;
      const endpointFound = await this.endpointService.getEndpointByEndpoint(tec_endpointendpoint);
      if (endpointFound) {
        await this.endpointService.updateEndpoint(endpointFound.TEC_EndpointId);
        return res.status(200).json("Último login atualizado com sucesso.");
      }
      return res.status(404).json({ error: "Endpoint não encontrado." });
    } catch (error: any) {
      console.error("Erro ao atualizar último login:", error);
      return res.status(500).json({ error: "Erro ao atualizar último login." });
    }
  }
}