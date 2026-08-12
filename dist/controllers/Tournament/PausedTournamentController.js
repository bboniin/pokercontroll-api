"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PausedTournamentController = void 0;
var _PausedTournamentService = require("../../services/Tournament/PausedTournamentService");
class PausedTournamentController {
  async handle(req, res) {
    const {
      tournament_id
    } = req.params;
    let club_id = req.club_id;
    const pausedTournamentService = new _PausedTournamentService.PausedTournamentService();
    const tournament = await pausedTournamentService.execute({
      club_id,
      tournament_id
    });
    return res.json(tournament);
  }
}
exports.PausedTournamentController = PausedTournamentController;