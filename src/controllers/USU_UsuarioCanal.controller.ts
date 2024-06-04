import { Request, Response } from 'express';
import USU_UsuarioCanalService from '../services/USU_UsuarioCanal.service';
import USU_UsuarioService from '../services/USU_Usuario.service';
import { USU_USUARIODTO } from '../config/interface.models';

export default class USU_UsuarioCanalController {
  private readonly usuarioCanalService: USU_UsuarioCanalService;
  private readonly usuarioService: USU_UsuarioService;

  constructor(usuarioCanalService: USU_UsuarioCanalService, usuarioService: USU_UsuarioService) {
    this.usuarioCanalService = usuarioCanalService;
    this.usuarioService = usuarioService;
  }

  public async getAllCanaisByUsuarioChv(req: Request, res: Response): Promise<Response> {
    try {
      const { usu_usuario }: { usu_usuario: USU_USUARIODTO } = req.body;
      const usuarioCanais = await this.usuarioCanalService.getAllCanaisByUsuarioChv(usu_usuario);
      return res.status(200).json(usuarioCanais);
    } catch (error: any) {
      console.error('Erro ao buscar os canais do usuário:', error);
      return res.status(500).json({ error: `Erro ao buscar os canais do usuário` });
    }
  }

  public async registerUsuarioCanal(req: Request, res: Response): Promise<Response> {
    try {
      const { tec_canais, usu_usuario }: { tec_canais: number[], usu_usuario: USU_USUARIODTO } = req.body;
      const userFound = await this.usuarioService.getUserByChvAcesso(usu_usuario.USU_UsuarioChave, usu_usuario.TEC_BaseAplicacaoId, usu_usuario.TEC_ParametroCodigoCliente);

      if (userFound) {
        await this.usuarioCanalService.createUsuarioCanalAll(tec_canais, userFound.USU_UsuarioId);
        return res.status(201).json("SUCESSO");
      }
      return res.status(404).json({ error: "Usuário não encontrado." });
    } catch (error: any) {
      console.error("Erro ao registrar usuário:", error);
      return res.status(500).json({ error: "Erro ao registrar usuário." });
    }
  }
}
