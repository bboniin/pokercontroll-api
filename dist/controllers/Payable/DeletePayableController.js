"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DeletePayableController = void 0;
var _DeletePayableService = require("../../services/Payable/DeletePayableService");
class DeletePayableController {
  async handle(req, res) {
    const {
      payable_id
    } = req.params;
    let club_id = req.club_id;
    const deletePayableService = new _DeletePayableService.DeletePayableService();
    const payable = await deletePayableService.execute({
      club_id,
      payable_id
    });
    return res.json(payable);
  }
}
exports.DeletePayableController = DeletePayableController;