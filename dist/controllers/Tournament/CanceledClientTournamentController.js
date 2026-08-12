"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CanceledClientTournamentController = void 0;
var _CanceledClientTournamentService = require("../../services/Tournament/CanceledClientTournamentService");
class CanceledClientTournamentController {
  async handle(req, res) {
    const {
      client_id
    } = req.params;
    const {
      tournament_id,
      transactions
    } = req.body;
    let club_id = req.club_id;
    let user_id = req.user_id;
    const canceledClientTournamentService = new _CanceledClientTournamentService.CanceledClientTournamentService();
    const tournament = await canceledClientTournamentService.execute({
      client_id,
      tournament_id,
      transactions,
      club_id,
      user_id
    });
    return res.json(tournament);
  }
}
exports.CanceledClientTournamentController = CanceledClientTournamentController;