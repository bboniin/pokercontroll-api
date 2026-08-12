"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ListRankingsController = void 0;
var _ListRankingsService = require("../../services/Ranking/ListRankingsService");
class ListRankingsController {
  async handle(req, res) {
    let {
      page,
      all
    } = req.query;
    let club_id = req.club_id;
    const listRankingsService = new _ListRankingsService.ListRankingsService();
    const {
      rankings,
      rankingsTotal
    } = await listRankingsService.execute({
      club_id,
      page: Number(page) > 0 ? Number(page) : 0,
      all: all == "true" ? true : false
    });
    return res.json({
      rankings,
      rankingsTotal
    });
  }
}
exports.ListRankingsController = ListRankingsController;