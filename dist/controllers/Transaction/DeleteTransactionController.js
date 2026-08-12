"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DeleteTransactionController = void 0;
var _DeleteTransactionService = require("../../services/Transaction/DeleteTransactionService");
class DeleteTransactionController {
  async handle(req, res) {
    const {
      id
    } = req.params;
    let club_id = req.club_id;
    const deleteTransactionService = new _DeleteTransactionService.DeleteTransactionService();
    try {
      const result = await deleteTransactionService.execute({
        id,
        club_id
      });
      return res.json(result);
    } catch (error) {
      return res.status(400).json({
        message: error.message
      });
    }
  }
}
exports.DeleteTransactionController = DeleteTransactionController;