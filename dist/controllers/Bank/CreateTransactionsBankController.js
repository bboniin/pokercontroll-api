"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CreateTransactionBankController = void 0;
var _CreateTransactionBankService = require("../../services/Bank/CreateTransactionBankService");
class CreateTransactionBankController {
  async handle(req, res) {
    const {
      name,
      observation,
      value,
      operation,
      bank_id
    } = req.body;
    let club_id = req.club_id;
    const createTransactionBankService = new _CreateTransactionBankService.CreateTransactionBankService();
    const bank = await createTransactionBankService.execute({
      name,
      value,
      club_id,
      observation,
      operation,
      bank_id
    });
    return res.json(bank);
  }
}
exports.CreateTransactionBankController = CreateTransactionBankController;