"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DeleteBankController = void 0;
var _DeleteBankService = require("../../services/Bank/DeleteBankService");
class DeleteBankController {
  async handle(req, res) {
    const {
      bank_id
    } = req.params;
    let club_id = req.club_id;
    const deleteBankService = new _DeleteBankService.DeleteBankService();
    const bank = await deleteBankService.execute({
      club_id,
      bank_id
    });
    return res.json(bank);
  }
}
exports.DeleteBankController = DeleteBankController;