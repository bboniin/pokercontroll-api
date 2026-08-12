"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EditPayableController = void 0;
var _EditPayableService = require("../../services/Payable/EditPayableService");
class EditPayableController {
  async handle(req, res) {
    const {
      payable_id
    } = req.params;
    const {
      name,
      observation,
      installmentsPaid,
      active,
      value,
      installments,
      account,
      period,
      recurrence,
      value_estimated,
      date_charge
    } = req.body;
    let club_id = req.club_id;
    const editPayableService = new _EditPayableService.EditPayableService();
    const payable = await editPayableService.execute({
      name,
      observation,
      value,
      installments,
      account,
      period,
      club_id,
      payable_id,
      installmentsPaid,
      active,
      value_estimated,
      recurrence,
      date_charge
    });
    return res.json(payable);
  }
}
exports.EditPayableController = EditPayableController;