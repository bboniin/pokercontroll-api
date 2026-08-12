"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.StartFinancialBoxService = void 0;
var _prisma = _interopRequireDefault(require("../../prisma"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class StartFinancialBoxService {
  async execute({
    user_id,
    club_id,
    value_initial
  }) {
    if (!user_id || !club_id) {
      throw new Error("Preencha os campos obrigatórios");
    }
    const user = await _prisma.default.user.findUnique({
      where: {
        id: user_id
      }
    });
    if (!user) {
      throw new Error("Usuário não encontrado");
    }
    const financialBoxOpen = await _prisma.default.financialBox.findFirst({
      where: {
        user_id: user_id,
        club_id: club_id,
        closed: false
      }
    });
    if (financialBoxOpen) {
      throw new Error("Já existe um caixa aberto no momento, não é possivel abrir outro");
    }
    const financialBox = await _prisma.default.financialBox.create({
      data: {
        club_id: club_id,
        value_initial: value_initial || 0,
        user_id: user_id,
        closed: false
      }
    });
    return financialBox;
  }
}
exports.StartFinancialBoxService = StartFinancialBoxService;