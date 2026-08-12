"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EditRakeService = void 0;
var _dateFns = require("date-fns");
var _prisma = _interopRequireDefault(require("../../prisma"));
var _functions = require("../../utils/functions");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class EditRakeService {
  async execute({
    club_id,
    value,
    id,
    user_id
  }) {
    const rakeGet = await _prisma.default.rake.findFirst({
      where: {
        id: id,
        cash: {
          club_id: club_id
        }
      }
    });
    if (!rakeGet) {
      throw new Error("Rake não encontrado");
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
      throw new Error("Preencha o valor do rake");
    }
    const rake = await _prisma.default.rake.update({
      where: {
        id: id
      },
      data: {
        historic: rakeGet.historic + `\nRake editado por ${user.name} no valor de ${(0, _functions.getValue)(rakeGet.value)} para ${(0, _functions.getValue)(value)} em ${(0, _dateFns.format)(new Date(), "dd/MM/yyyy HH:mm")}`,
        value: value
      }
    });
    return rake;
  }
}
exports.EditRakeService = EditRakeService;