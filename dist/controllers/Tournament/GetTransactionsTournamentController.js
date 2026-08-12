"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GetTransactionsTournamentController = void 0;
var _GetTransactionsTournamentService = require("../../services/Tournament/GetTransactionsTournamentService");
class GetTransactionsTournamentController {
  async handle(req, res) {
    const {
      tournament_id
    } = req.params;
    const {
      client_id
    } = req.query;
    let club_id = req.club_id;
    const getTransactionsTournamentService = new _GetTransactionsTournamentService.GetTransactionsTournamentService();
    const tournament = await getTransactionsTournamentService.execute({
      id: tournament_id,
      club_id,
      client_id: String(client_id)
    });
    return res.json(tournament);
  }
}
exports.GetTransactionsTournamentController = GetTransactionsTournamentController;