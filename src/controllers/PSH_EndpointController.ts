import { NextFunction, Request, Response } from 'express';
import PSH_EndpointService from '../services/PSH_EndpointService';
import SuccessResponse from '../SucessMessages/SuccessResponse';


export default class PSH_EndpointController {
  private psh_endpointService: PSH_EndpointService;

  constructor() {
    this.psh_endpointService = new PSH_EndpointService();
  }
  public async updateLastLogin(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const { tec_endpointendpoint } = req.body;
      const endpointFound = await this.psh_endpointService.getEndpointByEndpoint(tec_endpointendpoint);
      if (endpointFound) {
        await this.psh_endpointService.updateEndpointLastLogin(endpointFound.PSH_EndpointId);
        const response = SuccessResponse.create(null, 'Último login atualizado com sucesso.');
        return res.status(200).json(response);
      }
      return res.status(404).json({ error: "Endpoint não encontrado." });
    } catch (error: any) {
      console.error("Erro ao atualizar último login:", error);
      next(error);
    }
  }
}