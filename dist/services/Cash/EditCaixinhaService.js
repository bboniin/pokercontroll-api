"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EditCaixinhaService = void 0;
var _dateFns = require("date-fns");
var _prisma = _interopRequireDefault(require("../../prisma"));
var _functions = require("../../utils/functions");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class EditCaixinhaService {
  async execute({
    club_id,
    value,
    observation,
    id,
    user_id
  }) {
    const boxGet = await _prisma.default.box.findFirst({
      where: {
        id: id,
        cash: {
          club_id: club_id
        }
      }
    });
    if (!boxGet) {
      throw new Error("box não encontrada");
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
      throw new Error("Preencha o valor da box");
    }
    const box = await _prisma.default.box.update({
      where: {
        id: id
      },
      data: {
        historic: boxGet.historic + `\nCaixinha editada por ${user.name} no valor de ${(0, _functions.getValue)(boxGet.value)} para ${(0, _functions.getValue)(value)} em ${(0, _dateFns.format)(new Date(), "dd/MM/yyyy HH:mm")}`,
        value: value,
        observation: observation
      }
    });
    return box;
  }
}
exports.EditCaixinhaService = EditCaixinhaService;