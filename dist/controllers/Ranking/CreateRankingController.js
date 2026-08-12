"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CreateRankingController = void 0;
var _CreateRankingService = require("../../services/Ranking/CreateRankingService");
class CreateRankingController {
  async handle(req, res) {
    const {
      name,
      description,
      goal_value
    } = req.body;
    let club_id = req.club_id;
    const createRankingService = new _CreateRankingService.CreateRankingService();
    const ranking = await createRankingService.execute({
      name,
      goal_value: goal_value ? parseFloat(goal_value) : 0,
      description,
      club_id
    });
    return res.json(ranking);
  }
}
exports.CreateRankingController = CreateRankingController;