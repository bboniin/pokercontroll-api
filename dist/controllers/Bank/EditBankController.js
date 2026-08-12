"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EditBankController = void 0;
var _EditBankService = require("../../services/Bank/EditBankService");
class EditBankController {
  async handle(req, res) {
    const {
      bank_id
    } = req.params;
    const {
      name,
      balance
    } = req.body;
    let club_id = req.club_id;
    const editBankService = new _EditBankService.EditBankService();
    const bank = await editBankService.execute({
      name,
      balance,
      club_id,
      bank_id
    });
    return res.json(bank);
  }
}
exports.EditBankController = EditBankController;