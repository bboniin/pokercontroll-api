"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.OpenTournamentController = void 0;
var _OpenTournamentService = require("../../services/Tournament/OpenTournamentService");
class OpenTournamentController {
  async handle(req, res) {
    const {
      tournament_id
    } = req.params;
    let club_id = req.club_id;
    const openTournamentService = new _OpenTournamentService.OpenTournamentService();
    const tournament = await openTournamentService.execute({
      tournament_id,
      club_id
    });
    return res.json(tournament);
  }
}
exports.OpenTournamentController = OpenTournamentController;