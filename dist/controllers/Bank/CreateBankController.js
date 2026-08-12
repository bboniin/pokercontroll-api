"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CreateBankController = void 0;
var _CreateBankService = require("../../services/Bank/CreateBankService");
class CreateBankController {
  async handle(req, res) {
    const {
      name,
      balance
    } = req.body;
    let club_id = req.club_id;
    const createBankService = new _CreateBankService.CreateBankService();
    const bank = await createBankService.execute({
      name,
      balance,
      club_id
    });
    return res.json(bank);
  }
}
exports.CreateBankController = CreateBankController;