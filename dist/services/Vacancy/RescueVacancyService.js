"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RescueVacancyService = void 0;
var _dateFns = require("date-fns");
var _prisma = _interopRequireDefault(require("../../prisma"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class RescueVacancyService {
  async execute({
    vacancy_id,
    club_id,
    client_id,
    user_id
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
        rescue: false
      }
    });
    if (!vacancy) {
      throw new Error("Vaga não encontrada ou já utilizada");
    }
    const transaction = await _prisma.default.transaction.create({
      data: {
        type: "clube",
        value: vacancy.value,
        club_id: club_id,
        client_id: client_id,
        sector_id: vacancy.tournament_id,
        operation: "saida",
        date_payment: (0, _dateFns.addMonths)(new Date(), 1),
        observation: "",
        paid: false,
        user_id: user_id,
        value_paid: 0
      }
    });
    await _prisma.default.itemsTransaction.create({
      data: {
        name: "Resgate Vaga",
        value: vacancy.value,
        amount: 1,
        transaction_id: transaction.id
      }
    });
    await _prisma.default.client.update({
      where: {
        id: client_id
      },
      data: {
        receive: parseFloat((client.receive + vacancy.value).toFixed(2))
      }
    });
    await _prisma.default.vacancy.update({
      where: {
        id: vacancy_id
      },
      data: {
        rescue: true,
        date_rescue: new Date()
      }
    });
    return "Vaga utilizada com sucesso";
  }
}
exports.RescueVacancyService = RescueVacancyService;