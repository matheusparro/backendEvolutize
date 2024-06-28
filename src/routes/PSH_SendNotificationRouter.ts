import express from 'express';
import PSH_SendNotificationController from '../controllers/PSH_SendNotificationController';

const router = express.Router();
const sendNotificationController = new PSH_SendNotificationController();

// Rota para enviar notificações push
router.post('/notification/push/send', async (req, res, next) => {
  try {
    await sendNotificationController.sendPushNotification(req, res, next);
  } catch (error: any) {
    next(error);
  }
});

export default router;
