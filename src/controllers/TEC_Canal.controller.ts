import { Request, Response } from 'express';
import TEC_CanalService, { CanalQueryParams } from '../services/TEC_Canal.service';
import { TEC_CANALDTO } from '../config/interface.models';

export default class TEC_CanalController {
  private canalService: TEC_CanalService;

  constructor(canalService: TEC_CanalService) {
    this.canalService = canalService;
  }

  async createCanal(req: Request, res: Response): Promise<void> {
    try {
      const newCanal: TEC_CANALDTO = req.body;
      const canal = await this.canalService.createCanal(newCanal);
      res.status(201).json(canal);
    } catch (error) {
      console.error("Erro ao criar canal:", error);
      res.status(500).json({ error: "Erro ao criar canal." });
    }
  }

  async getAllCanais(req: Request, res: Response): Promise<void> {
    try {
      const queryParams: CanalQueryParams = req.query as CanalQueryParams;;
      const canais = await this.canalService.getAllCanais(queryParams);
      res.status(201).json(canais);
    } catch (error) {
      console.error("Erro ao buscar todos os canais:", error);
      res.status(500).json({ error: "Erro ao buscar todos os canais." });
    }
  }

  async getCanalById(req: Request, res: Response): Promise<void> {
    try {
      const canalId = parseInt(req.params.id);
      const canal = await this.canalService.getCanalById(canalId);
      if (canal) {
        res.status(200).json(canal);
      } else {
        res.status(404).json({ error: "Canal não encontrado." });
      }
    } catch (error) {
      console.error("Erro ao buscar canal por ID:", error);
      res.status(500).json({ error: "Erro ao buscar canal por ID." });
    }
  }

  async updateCanal(req: Request, res: Response): Promise<void> {
    try {
      const canalId = parseInt(req.params.id);
      const updatedCanal: Partial<TEC_CANALDTO> = req.body;
      const canal = await this.canalService.updateCanal(canalId, updatedCanal);
      res.status(200).json(canal);
    } catch (error) {
      console.error("Erro ao atualizar canal:", error);
      res.status(500).json({ error: "Erro ao atualizar canal." });
    }
  }

  async deleteCanal(req: Request, res: Response): Promise<void> {
    try {
      const canalId = parseInt(req.params.id);
      await this.canalService.deleteCanal(canalId);
      res.status(204).send();
    } catch (error) {
      console.error("Erro ao excluir canal:", error);
      res.status(500).json({ error: "Erro ao excluir canal." });
    }
  }
}
