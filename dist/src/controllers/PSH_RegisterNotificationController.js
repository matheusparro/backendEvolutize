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
const PSH_RegisterNotificationService_1 = __importDefault(require("../services/PSH_RegisterNotificationService"));
class TEC_RegisterNotificationController {
    constructor() {
        this.registerNotificationService = new PSH_RegisterNotificationService_1.default();
    }
    registerNotification(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const subscription = req.body.subscription;
                const psh_usuario = req.body.psh_usuario;
                yield this.registerNotificationService.register(subscription, psh_usuario);
                res.status(201).send('Notification registered successfully.');
            }
            catch (error) {
                console.error('Error registering notification:', error);
                res.status(500).send({ error: 'Falha ao registrar usuário/endpoint.' });
            }
        });
    }
}
exports.default = TEC_RegisterNotificationController;
