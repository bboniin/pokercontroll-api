"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ReturnClientTournamentController = void 0;
var _ReturnClientTournamentService = require("../../services/Tournament/ReturnClientTournamentService");
class ReturnClientTournamentController {
  async handle(req, res) {
    const {
      client_id,
      tournament_id
    } = req.body;
    let club_id = req.club_id;
    let user_id = req.user_id;
    const returnClientTournamentService = new _ReturnClientTournamentService.ReturnClientTournamentService();
    const tournament = await returnClientTournamentService.execute({
      client_id,
      tournament_id,
      club_id
    });
    return res.json(tournament);
  }
}
exports.ReturnClientTournamentController = ReturnClientTournamentController;