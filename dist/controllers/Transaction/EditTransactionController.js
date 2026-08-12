"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EditTransactionController = void 0;
var _EditTransactionService = require("../../services/Transaction/EditTransactionService");
class EditTransactionController {
  async handle(req, res) {
    const {
      id
    } = req.params;
    const {
      observation,
      value,
      methods_transaction,
      date_payment
    } = req.body;
    let club_id = req.club_id;
    let user_id = req.user_id;
    const editTransactionService = new _EditTransactionService.EditTransactionService();
    try {
      const transaction = await editTransactionService.execute({
        id,
        club_id,
        observation,
        value: value ? parseFloat(value) : 0,
        methods_transaction,
        date_payment,
        user_id
      });
      return res.json(transaction);
    } catch (error) {
      return res.status(400).json({
        message: error.message
      });
    }
  }
}
exports.EditTransactionController = EditTransactionController;