"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GetFinancialBoxController = void 0;
var _GetFinancialBoxService = require("../../services/FinancialBox/GetFinancialBoxService");
class GetFinancialBoxController {
  async handle(req, res) {
    let {
      box_id
    } = req.query;
    let club_id = req.club_id;
    let user_id = req.user_id;
    const getFinancialBoxService = new _GetFinancialBoxService.GetFinancialBoxService();
    const financialBox = await getFinancialBoxService.execute({
      user_id,
      club_id,
      box_id: box_id ? String(box_id) : ""
    });
    return res.json(financialBox);
  }
}
exports.GetFinancialBoxController = GetFinancialBoxController;