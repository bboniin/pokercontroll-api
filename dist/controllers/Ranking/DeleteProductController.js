"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DeleteRankingController = void 0;
var _DeleteRankingService = require("../../services/Ranking/DeleteRankingService");
class DeleteRankingController {
  async handle(req, res) {
    const {
      ranking_id
    } = req.params;
    let club_id = req.club_id;
    const deleteRankingService = new _DeleteRankingService.DeleteRankingService();
    const ranking = await deleteRankingService.execute({
      club_id,
      ranking_id
    });
    return res.json(ranking);
  }
}
exports.DeleteRankingController = DeleteRankingController;