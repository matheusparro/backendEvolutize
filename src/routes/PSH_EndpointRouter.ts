import express from 'express';
import PSH_EndpointController from '../controllers/PSH_EndpointController';

const router = express.Router();
const psh_endpointController = new PSH_EndpointController();
router.post('/notification/endpoint/lastlogin', async (req, res) => {
  try {
    await psh_endpointController.updateLastLogin(req, res);
  } catch (error: any) {
    console.error("Erro na rota ao atualizar último login:", error);
    return res.status(500).json({ error: "Erro ao atualizar último login." });
  }
});
  

export default router;
