"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GetTournamentController = void 0;
var _GetTournamentService = require("../../services/Tournament/GetTournamentService");
class GetTournamentController {
  async handle(req, res) {
    const {
      tournament_id
    } = req.params;
    const {
      blind
    } = req.query;
    let club_id = req.club_id;
    const getTournamentService = new _GetTournamentService.GetTournamentService();
    const tournament = await getTournamentService.execute({
      id: tournament_id,
      club_id,
      blind: blind == "true"
    });
    return res.json(tournament);
  }
}
exports.GetTournamentController = GetTournamentController;