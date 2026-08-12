"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CreatePayableController = void 0;
var _CreatePayableService = require("../../services/Payable/CreatePayableService");
class CreatePayableController {
  async handle(req, res) {
    const {
      name,
      observation,
      value,
      recurrence,
      installments,
      account,
      period,
      date_charge,
      value_estimated
    } = req.body;
    let club_id = req.club_id;
    let user_id = req.user_id;
    const createPayableService = new _CreatePayableService.CreatePayableService();
    const payable = await createPayableService.execute({
      name,
      observation,
      value,
      installments,
      account,
      period,
      recurrence,
      date_charge,
      value_estimated,
      club_id,
      user_id
    });
    return res.json(payable);
  }
}
exports.CreatePayableController = CreatePayableController;