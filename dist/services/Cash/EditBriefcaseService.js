"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EditBriefcaseService = void 0;
var _dateFns = require("date-fns");
var _prisma = _interopRequireDefault(require("../../prisma"));
var _functions = require("../../utils/functions");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class EditBriefcaseService {
  async execute({
    club_id,
    value,
    id,
    user_id
  }) {
    const cash = await _prisma.default.cash.findFirst({
      where: {
        id: id,
        club_id: club_id
      }
    });
    if (!cash) {
      throw new Error("Cashgame não encontrado");
    }
    const user = await _prisma.default.user.findFirst({
      where: {
        id: user_id,
        club_id: club_id
      }
    });
    if (!user) {
      throw new Error("Usuário não encontrado");
    }
    if (!value) {
      throw new Error("Preencha o valor do maleta");
    }
    const briefcase = await _prisma.default.cash.update({
      where: {
        id: id
      },
      data: {
        historic_briefcase: cash.historic_briefcase + `\nMaleta editada por ${user.name} no valor de ${(0, _functions.getValue)(cash.briefcase)} para ${(0, _functions.getValue)(value)} em ${(0, _dateFns.format)(new Date(), "dd/MM/yyyy HH:mm")}`,
        briefcase: value
      }
    });
    return briefcase;
  }
}
exports.EditBriefcaseService = EditBriefcaseService;