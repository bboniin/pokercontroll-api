"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.StartFinancialBoxController = void 0;
var _StartFinancialBoxService = require("../../services/FinancialBox/StartFinancialBoxService");
class StartFinancialBoxController {
  async handle(req, res) {
    let club_id = req.club_id;
    let user_id = req.user_id;
    const {
      value_initial
    } = req.body;
    const startFinancialBoxService = new _StartFinancialBoxService.StartFinancialBoxService();
    const financialBox = await startFinancialBoxService.execute({
      user_id,
      club_id,
      value_initial
    });
    return res.json(financialBox);
  }
}
exports.StartFinancialBoxController = StartFinancialBoxController;