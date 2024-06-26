import { Request, Response } from 'express';
import PSH_EndpointService from '../services/PSH_EndpointService';


export default class PSH_EndpointController {
  private psh_endpointService: PSH_EndpointService;

  constructor() {
    this.psh_endpointService = new PSH_EndpointService();
  }
  public async updateLastLogin(req: Request, res: Response): Promise<Response> {
    try {
      const { tec_endpointendpoint } = req.body;
      const endpointFound = await this.psh_endpointService.getEndpointByEndpoint(tec_endpointendpoint);
      if (endpointFound) {
        await this.psh_endpointService.updateEndpointLastLogin(endpointFound.PSH_EndpointId);
        return res.status(200).json("Último login atualizado com sucesso.");
      }
      return res.status(404).json({ error: "Endpoint não encontrado." });
    } catch (error: any) {
      console.error("Erro ao atualizar último login:", error);
      return res.status(500).json({ error: "Erro ao atualizar último login." });
    }
  }
}