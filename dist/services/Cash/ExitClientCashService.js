"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ExitClientCashService = void 0;
var _prisma = _interopRequireDefault(require("../../prisma"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class ExitClientCashService {
  async execute({
    client_id,
    cash_id,
    club_id
  }) {
    if (!client_id) {
      throw new Error("Id do cliente é obrigatório");
    }
    const cash = await _prisma.default.cash.findFirst({
      where: {
        club_id: club_id,
        id: cash_id
      }
    });
    if (!cash) {
      throw new Error("Sessão cash não encontrada");
    }
    const chairClient = await _prisma.default.clientCash.findFirst({
      where: {
        client_id: client_id,
        cash_id: cash_id,
        chair_cash: {
          contains: "C"
        }
      }
    });
    if (!chairClient) {
      throw new Error("Cliente não foi encontrado");
    }
    const client = await _prisma.default.clientCash.update({
      where: {
        id: chairClient.id
      },
      data: {
        chair_cash: "",
        exit: true,
        date_out: new Date()
      }
    });
    return client;
  }
}
exports.ExitClientCashService = ExitClientCashService;