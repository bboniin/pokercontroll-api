"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ListFinancialBoxsClubController = void 0;
var _ListFinancialBoxsClubService = require("../../services/FinancialBox/ListFinancialBoxsClubService");
class ListFinancialBoxsClubController {
  async handle(req, res) {
    let {
      page,
      all,
      user_id
    } = req.query;
    let club_id = req.club_id;
    let admin_id = req.user_id;
    const listFinancialBoxsClubService = new _ListFinancialBoxsClubService.ListFinancialBoxsClubService();
    const financialBoxsClub = await listFinancialBoxsClubService.execute({
      club_id,
      user_id: user_id ? String(user_id) : "",
      admin_id,
      page: Number(page) > 0 ? Number(page) : 0,
      all: all == "true" ? true : false
    });
    return res.json(financialBoxsClub);
  }
}
exports.ListFinancialBoxsClubController = ListFinancialBoxsClubController;