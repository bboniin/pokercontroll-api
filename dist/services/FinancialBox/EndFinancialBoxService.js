"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EndFinancialBoxService = void 0;
var _prisma = _interopRequireDefault(require("../../prisma"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class EndFinancialBoxService {
  async execute({
    user_id,
    club_id,
    box_id
  }) {
    const user = await _prisma.default.user.findUnique({
      where: {
        id: user_id
      }
    });
    if (!user) {
      throw new Error("Usuário não encontrado");
    }
    const financialBox = await _prisma.default.financialBox.findFirst({
      where: {
        id: box_id,
        club_id: club_id
      }
    });
    if (!financialBox) {
      throw new Error("Caixa não encontrado");
    }
    if (financialBox.closed) {
      throw new Error("Caixa já finalizado");
    }
    const financialBoxEnd = await _prisma.default.financialBox.update({
      where: {
        id: box_id
      },
      data: {
        date_end: new Date(),
        closed: true
      }
    });
    return financialBoxEnd;
  }
}
exports.EndFinancialBoxService = EndFinancialBoxService;