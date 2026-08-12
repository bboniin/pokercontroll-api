"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ChargePayablesService = void 0;
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
class ChargePayablesService {
  async execute({
    user_id
  }) {
    const payables = await _prisma.default.payable.findMany({
      where: {
        date_charge: {
          lt: (0, _dateFns.endOfDay)((0, _dateFns.addDays)(new Date(), 1))
        }
      }
    });
    await Promise.all(await payables.map(async payable => {
      await _prisma.default.transaction.create({
        data: {
          type: payable.account,
          value: payable.value,
          club_id: payable.club_id,
          operation: "saida",
          date_payment: new Date(),
          observation: payable.recurrence ? "Cobrança recorrente" : `${payable.installmentsPaid + 1}/${payable.installments} parcelas`,
          paid: false,
          value_paid: 0,
          sector_id: payable.id,
          user_id: user_id,
          items_transaction: {
            create: [{
              name: payable.name,
              value: payable.value,
              amount: 1
            }]
          }
        }
      });
      await _prisma.default.payable.update({
        where: {
          id: payable.id
        },
        data: {
          installmentsPaid: payable.installmentsPaid + 1,
          date_charge: periodToDays(payable.period)
        }
      });
    }));
    return "Cobranças criadas";
  }
}
exports.ChargePayablesService = ChargePayablesService;