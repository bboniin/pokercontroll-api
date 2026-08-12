"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CreatePayableService = void 0;
var _dateFns = require("date-fns");
var _prisma = _interopRequireDefault(require("../../prisma"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function periodToDays(period) {
  switch (period) {
    case "semanal":
      {
        return (0, _dateFns.addDays)(new Date(), 7);
      }
    case "quinzenal":
      {
        return (0, _dateFns.addDays)(new Date(), 15);
      }
    case "mensal":
      {
        return (0, _dateFns.addMonths)(new Date(), 1);
      }
    case "bimestral":
      {
        return (0, _dateFns.addMonths)(new Date(), 2);
      }
    case "trimestral":
      {
        return (0, _dateFns.addMonths)(new Date(), 3);
      }
    case "semestral":
      {
        return (0, _dateFns.addMonths)(new Date(), 6);
      }
    case "anual":
      {
        return (0, _dateFns.addYears)(new Date(), 1);
      }
    default:
      {
        throw new Error("Periodo selecionado é inválido");
      }
  }
}
class CreatePayableService {
  async execute({
    name,
    club_id,
    value,
    period,
    installments,
    account,
    observation,
    date_charge,
    recurrence,
    value_estimated,
    user_id
  }) {
    if (!account || !value || !period || !recurrence && !installments || !name || !date_charge || !club_id) {
      throw new Error("Preencha os campos obrigatórios");
    }
    date_charge = (0, _dateFns.startOfDay)(new Date(date_charge));
    let newDateCharge = date_charge;
    if ((0, _dateFns.isToday)(date_charge) || (0, _dateFns.isTomorrow)(date_charge)) {
      newDateCharge = periodToDays(period);
    }
    const payable = await _prisma.default.payable.create({
      data: {
        name: name,
        value: value,
        period: period,
        installments: recurrence ? 0 : installments,
        observation: observation,
        installmentsPaid: newDateCharge != date_charge ? 1 : 0,
        account: account,
        recurrence: recurrence,
        date_charge: newDateCharge,
        value_estimated: value_estimated,
        club_id: club_id
      }
    });
    if (newDateCharge != date_charge) {
      await _prisma.default.transaction.create({
        data: {
          type: account,
          value: value,
          club_id: club_id,
          operation: "saida",
          date_payment: date_charge,
          observation: recurrence ? "Cobrança recorrente" : `1/${installments} parcelas`,
          paid: false,
          value_paid: 0,
          user_id: user_id,
          editable: value_estimated,
          sector_id: payable.id,
          items_transaction: {
            create: [{
              name: name,
              value: value,
              amount: 1
            }]
          }
        }
      });
    }
    return "Despesa recorrente criada";
  }
}
exports.CreatePayableService = CreatePayableService;