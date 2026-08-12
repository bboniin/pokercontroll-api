"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SendVacancyService = void 0;
var _prisma = _interopRequireDefault(require("../../prisma"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class SendVacancyService {
  async execute({
    vacancy_id,
    client_id,
    club_id
  }) {
    const client = await _prisma.default.client.findFirst({
      where: {
        id: client_id,
        club_id: club_id
      }
    });
    if (!client) {
      throw new Error("Cliente não encontrado");
    }
    const vacancy = await _prisma.default.vacancy.findFirst({
      where: {
        id: vacancy_id,
        client_id: null
      }
    });
    if (!vacancy) {
      throw new Error("Vaga não encontrada ou já enviada");
    }
    await _prisma.default.vacancy.update({
      where: {
        id: vacancy_id
      },
      data: {
        client_id: client.id
      }
    });
    return "Vaga enviada com sucesso";
  }
}
exports.SendVacancyService = SendVacancyService;