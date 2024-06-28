"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const PSH_SendNotificationService_1 = __importDefault(require("../services/PSH_SendNotificationService"));
const sendNotificationService = new PSH_SendNotificationService_1.default();
class PSH_SendNotificationController {
    // Método para enviar notificações push
    sendPushNotification(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { users, TEC_ClienteCodigo, TEC_AplicacaoId, message } = req.body;
            // Validação dos parâmetros da requisição
            if (!users || !TEC_ClienteCodigo || !TEC_AplicacaoId || !message) {
                return res.status(400).json({ error: 'Todos os parâmetros são obrigatórios: users, TEC_ClienteCodigo, TEC_AplicacaoId, message' });
            }
            try {
                // Dispara o processamento em background sem esperar o resultado
                sendNotificationService.sendNotifications(users, { users, TEC_ClienteCodigo, TEC_AplicacaoId, message })
                    .then(() => {
                    console.log('Notificações processadas em background.');
                })
                    .catch((error) => {
                    console.error("Erro ao processar notificações em background:", error);
                });
                // Retorna a resposta imediatamente
                return res.sendStatus(200);
            }
            catch (error) {
                console.error("Erro ao enviar notificações:", error);
                return res.status(500).json({ error: 'Erro ao enviar notificações' });
            }
        });
    }
}
exports.default = PSH_SendNotificationController;
