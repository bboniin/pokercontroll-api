"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MoveCashService = void 0;
var _prisma = _interopRequireDefault(require("../../prisma"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class MoveCashService {
  async execute({
    id,
    chair,
    cash_id
  }) {
    if (!id || !chair) {
      throw new Error("Id do cliente e posição da mesa é obrigatório");
    }
    const getChairCash = await _prisma.default.clientCash.findFirst({
      where: {
        cash_id: cash_id,
        chair_cash: chair
      }
    });
    if (getChairCash) {
      throw new Error("Posição já está sendo ocupada");
    }
    const getClientCash = await _prisma.default.clientCash.findFirst({
      where: {
        cash_id: cash_id,
        client_id: id
      }
    });
    if (getClientCash) {
      const client = await _prisma.default.clientCash.update({
        where: {
          id: getClientCash.id
        },
        data: {
          chair_cash: "C" + chair
        }
      });
      return client;
    } else {
      const client = await _prisma.default.clientCash.create({
        data: {
          chair_cash: "C" + chair,
          cash_id: cash_id,
          client_id: id
        }
      });
      return client;
    }
  }
}
exports.MoveCashService = MoveCashService;