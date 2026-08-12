"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.InitialTournamentController = void 0;
var _InitialTournamentService = require("../../services/Tournament/InitialTournamentService");
class InitialTournamentController {
  async handle(req, res) {
    const {
      tournament_id
    } = req.params;
    let club_id = req.club_id;
    const initialTournamentService = new _InitialTournamentService.InitialTournamentService();
    const tournament = await initialTournamentService.execute({
      tournament_id,
      club_id
    });
    return res.json(tournament);
  }
}
exports.InitialTournamentController = InitialTournamentController;