"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ListFinancialBoxsController = void 0;
var _ListFinancialBoxsService = require("../../services/FinancialBox/ListFinancialBoxsService");
class ListFinancialBoxsController {
  async handle(req, res) {
    let {
      page,
      all
    } = req.query;
    let club_id = req.club_id;
    let user_id = req.user_id;
    const listFinancialBoxsService = new _ListFinancialBoxsService.ListFinancialBoxsService();
    const financialBoxs = await listFinancialBoxsService.execute({
      club_id,
      user_id,
      page: Number(page) > 0 ? Number(page) : 0,
      all: all == "true" ? true : false
    });
    return res.json(financialBoxs);
  }
}
exports.ListFinancialBoxsController = ListFinancialBoxsController;