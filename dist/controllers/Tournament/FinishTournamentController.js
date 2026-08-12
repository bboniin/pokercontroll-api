"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FinishTournamentController = void 0;
var _FinishTournamentService = require("../../services/Tournament/FinishTournamentService");
class FinishTournamentController {
  async handle(req, res) {
    const {
      tournament_id
    } = req.params;
    const {
      classifieds
    } = req.body;
    let club_id = req.club_id;
    const finishTournamentService = new _FinishTournamentService.FinishTournamentService();
    const tournament = await finishTournamentService.execute({
      tournament_id,
      club_id,
      classifieds
    });
    return res.json(tournament);
  }
}
exports.FinishTournamentController = FinishTournamentController;