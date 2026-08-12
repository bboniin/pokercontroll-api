"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GetRankingController = void 0;
var _GetRankingService = require("../../services/Ranking/GetRankingService");
class GetRankingController {
  async handle(req, res) {
    const {
      ranking_id
    } = req.params;
    let club_id = req.club_id;
    const getRankingService = new _GetRankingService.GetRankingService();
    const ranking = await getRankingService.execute({
      ranking_id,
      club_id
    });
    return res.json(ranking);
  }
}
exports.GetRankingController = GetRankingController;