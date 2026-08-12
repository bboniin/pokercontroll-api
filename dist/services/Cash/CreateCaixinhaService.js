"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CreateCaixinhaService = void 0;
var _dateFns = require("date-fns");
var _prisma = _interopRequireDefault(require("../../prisma"));
var _functions = require("../../utils/functions");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class CreateCaixinhaService {
  async execute({
    club_id,
    value,
    observation,
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
      throw new Error("Preencha o valor da caixinha");
    }
    const box = await _prisma.default.box.create({
      data: {
        historic: `Caixinha criada por ${user.name} no valor de ${(0, _functions.getValue)(value)} em ${(0, _dateFns.format)(new Date(), "dd/MM/yyyy HH:mm")}`,
        value: value,
        cash_id: id,
        observation: observation
      }
    });
    return box;
  }
}
exports.CreateCaixinhaService = CreateCaixinhaService;