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
const PSH_EndpointController_1 = __importDefault(require("../controllers/PSH_EndpointController"));
const router = express_1.default.Router();
const psh_endpointController = new PSH_EndpointController_1.default();
router.post('/notification/endpoint/lastlogin', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield psh_endpointController.updateLastLogin(req, res);
    }
    catch (error) {
        console.error("Erro na rota ao atualizar último login:", error);
        return res.status(500).json({ error: "Erro ao atualizar último login." });
    }
}));
exports.default = router;
