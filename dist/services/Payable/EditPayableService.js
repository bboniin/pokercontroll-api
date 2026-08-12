"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EditPayableService = void 0;
var _prisma = _interopRequireDefault(require("../../prisma"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class EditPayableService {
  async execute({
    name,
    club_id,
    value,
    period,
    installments,
    payable_id,
    observation,
    account,
    installmentsPaid,
    active,
    recurrence,
    date_charge,
    value_estimated
  }) {
    if (!payable_id || !value || !period || !recurrence && !installments || !account || !name || !club_id || !date_charge) {
      throw new Error("Preencha os campos obrigatórios");
    }
    const payable = await _prisma.default.payable.findFirst({
      where: {
        id: payable_id,
        club_id: club_id
      }
    });
    if (!payable) {
      throw new Error("Despesa recorrente não encontrada");
    }
    const payableEdit = await _prisma.default.payable.update({
      where: {
        id: payable_id
      },
      data: {
        name: name,
        value: value,
        period: period,
        active: active,
        account: account,
        installments: recurrence ? 0 : installments,
        observation: observation,
        recurrence: recurrence,
        date_charge: date_charge,
        value_estimated: value_estimated,
        installmentsPaid: recurrence ? 0 : installmentsPaid || 1
      }
    });
    return payableEdit;
  }
}
exports.EditPayableService = EditPayableService;