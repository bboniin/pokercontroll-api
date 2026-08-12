"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FinishRankingController = void 0;
var _FinishRankingService = require("../../services/Ranking/FinishRankingService");
class FinishRankingController {
  async handle(req, res) {
    const {
      ranking_id
    } = req.params;
    let club_id = req.club_id;
    const finishRankingService = new _FinishRankingService.FinishRankingService();
    const ranking = await finishRankingService.execute({
      club_id,
      ranking_id
    });
    return res.json(ranking);
  }
}
exports.FinishRankingController = FinishRankingController;