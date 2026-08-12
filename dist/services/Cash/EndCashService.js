"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EndCashService = void 0;
var _prisma = _interopRequireDefault(require("../../prisma"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class EndCashService {
  async execute({
    cash_id,
    club_id
  }) {
    const clientsCash = await _prisma.default.clientCash.findFirst({
      where: {
        cash_id: cash_id,
        chair_cash: {
          contains: "C"
        }
      }
    });
    if (clientsCash) {
      throw new Error("Remova todos clientes para finalizar sessão de cash");
    }
    const cash = await _prisma.default.cash.update({
      where: {
        id: cash_id
      },
      data: {
        closed: true,
        date_out: new Date()
      }
    });
    return cash;
  }
}
exports.EndCashService = EndCashService;