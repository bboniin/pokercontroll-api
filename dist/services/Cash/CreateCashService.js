"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CreateCashService = void 0;
var _dateFns = require("date-fns");
var _prisma = _interopRequireDefault(require("../../prisma"));
var _functions = require("../../utils/functions");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class CreateCashService {
  async execute({
    club_id,
    briefcase,
    user_id,
    name,
    chairs
  }) {
    if (!briefcase || !name) {
      throw new Error("Preencha o valor da maleta e nome do cashgame");
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
    const cash = await _prisma.default.cash.create({
      data: {
        name: name,
        club_id: club_id,
        chairs: chairs || 15,
        briefcase: briefcase,
        historic_briefcase: `Maleta criada por ${user.name} no valor de ${(0, _functions.getValue)(briefcase)} em ${(0, _dateFns.format)(new Date(), "dd/MM/yyyy HH:mm")}`,
        closed: false
      }
    });
    return cash;
  }
}
exports.CreateCashService = CreateCashService;