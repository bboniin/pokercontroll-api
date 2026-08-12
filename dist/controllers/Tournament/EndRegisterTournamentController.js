"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EndRegisterTournamentController = void 0;
var _EndRegisterTournamentService = require("../../services/Tournament/EndRegisterTournamentService");
class EndRegisterTournamentController {
  async handle(req, res) {
    const {
      tournament_id
    } = req.params;
    const {
      award,
      staff
    } = req.body;
    let club_id = req.club_id;
    const endRegisterTournamentService = new _EndRegisterTournamentService.EndRegisterTournamentService();
    const tournament = await endRegisterTournamentService.execute({
      tournament_id,
      club_id,
      award,
      staff: isNaN(parseFloat(staff)) ? 0 : parseFloat(staff)
    });
    return res.json(tournament);
  }
}
exports.EndRegisterTournamentController = EndRegisterTournamentController;