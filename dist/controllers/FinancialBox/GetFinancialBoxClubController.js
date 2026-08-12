"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GetFinancialBoxClubController = void 0;
var _GetFinancialBoxClubService = require("../../services/FinancialBox/GetFinancialBoxClubService");
class GetFinancialBoxClubController {
  async handle(req, res) {
    let {
      box_id
    } = req.params;
    let club_id = req.club_id;
    let user_id = req.user_id;
    const getFinancialBoxClubService = new _GetFinancialBoxClubService.GetFinancialBoxClubService();
    const financialBox = await getFinancialBoxClubService.execute({
      user_id,
      club_id,
      box_id
    });
    return res.json(financialBox);
  }
}
exports.GetFinancialBoxClubController = GetFinancialBoxClubController;