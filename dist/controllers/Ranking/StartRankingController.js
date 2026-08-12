"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.StartRankingController = void 0;
var _StartRankingService = require("../../services/Ranking/StartRankingService");
class StartRankingController {
  async handle(req, res) {
    const {
      ranking_id
    } = req.params;
    let club_id = req.club_id;
    const startRankingService = new _StartRankingService.StartRankingService();
    const ranking = await startRankingService.execute({
      club_id,
      ranking_id
    });
    return res.json(ranking);
  }
}
exports.StartRankingController = StartRankingController;