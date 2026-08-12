"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EditRankingController = void 0;
var _EditRankingService = require("../../services/Ranking/EditRankingService");
class EditRankingController {
  async handle(req, res) {
    const {
      ranking_id
    } = req.params;
    const {
      name,
      goal_value,
      description
    } = req.body;
    let club_id = req.club_id;
    const editRankingService = new _EditRankingService.EditRankingService();
    const ranking = await editRankingService.execute({
      name,
      goal_value: goal_value ? parseFloat(goal_value) : 0,
      description,
      club_id,
      ranking_id
    });
    return res.json(ranking);
  }
}
exports.EditRankingController = EditRankingController;