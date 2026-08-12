"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EndFinancialBoxController = void 0;
var _EndFinancialBoxService = require("../../services/FinancialBox/EndFinancialBoxService");
class EndFinancialBoxController {
  async handle(req, res) {
    const {
      box_id
    } = req.params;
    let club_id = req.club_id;
    let user_id = req.user_id;
    const endFinancialBoxService = new _EndFinancialBoxService.EndFinancialBoxService();
    const financialBox = await endFinancialBoxService.execute({
      box_id,
      user_id,
      club_id
    });
    return res.json(financialBox);
  }
}
exports.EndFinancialBoxController = EndFinancialBoxController;