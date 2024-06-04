import express from 'express';
import TEC_CanalController from '../controllers/TEC_Canal.controller';
import TEC_CanalService from '../services/TEC_Canal.service';
import { clientManager, transactionScope } from '../config/transactions';
import USU_UsuarioCanalService from '../services/USU_UsuarioCanal.service';
import USU_UsuarioCanalController from '../controllers/USU_UsuarioCanal.controller';
import USU_UsuarioService from '../services/USU_Usuario.service';

const router = express.Router();
const usuarioCanalService = new USU_UsuarioCanalService(transactionScope, clientManager);
const usuarioService = new USU_UsuarioService(transactionScope, clientManager);
const usu_usuariocanalcontrol = new USU_UsuarioCanalController(usuarioCanalService,usuarioService);

router.post('/notification/usuario-canais/byuser', async (req, res) => {
    try {
      await usu_usuariocanalcontrol.getAllCanaisByUsuarioChv(req, res);
    } catch (error: any) {
      console.error('Erro na rota ao buscar os canais do usuário:', error);
      return res.status(500).json({ error: `Erro ao buscar os canais do usuário: ${error.message}` });
    }
  });

  router.post('/notification/push/usu_usuariocanal/register', async (req, res) => {
    try {
      await usu_usuariocanalcontrol.registerUsuarioCanal(req, res);
    } catch (error: any) {
      console.error("Erro na rota ao registrar usuário:", error);
      return res.status(500).json({ error: "Erro ao registrar usuário." });
    }
  });
  
  

export default router;
