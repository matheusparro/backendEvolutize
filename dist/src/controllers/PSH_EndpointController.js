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
const PSH_EndpointService_1 = __importDefault(require("../services/PSH_EndpointService"));
class PSH_EndpointController {
    constructor() {
        this.psh_endpointService = new PSH_EndpointService_1.default();
    }
    updateLastLogin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { tec_endpointendpoint } = req.body;
                const endpointFound = yield this.psh_endpointService.getEndpointByEndpoint(tec_endpointendpoint);
                if (endpointFound) {
                    yield this.psh_endpointService.updateEndpointLastLogin(endpointFound.PSH_EndpointId);
                    return res.status(200).json("Último login atualizado com sucesso.");
                }
                return res.status(404).json({ error: "Endpoint não encontrado." });
            }
            catch (error) {
                console.error("Erro ao atualizar último login:", error);
                return res.status(500).json({ error: "Erro ao atualizar último login." });
            }
        });
    }
}
exports.default = PSH_EndpointController;
