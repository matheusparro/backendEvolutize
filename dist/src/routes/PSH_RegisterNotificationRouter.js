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
const express_1 = __importDefault(require("express"));
const PSH_RegisterNotificationController_1 = __importDefault(require("../controllers/PSH_RegisterNotificationController"));
const router = express_1.default.Router();
const psh_registerNotificationController = new PSH_RegisterNotificationController_1.default();
router.post('/notification/push/register', (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("FOIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII");
        yield psh_registerNotificationController.registerNotification(request, response);
    }
    catch (error) {
        console.error("Erro ao registrar usuário:", error.message);
        return response.status(500).json({ error: "Erro ao registrar usuário." });
    }
}));
exports.default = router;
