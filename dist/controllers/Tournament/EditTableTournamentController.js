"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EditTableTournamentController = void 0;
var _EditTableTournamentService = require("../../services/Tournament/EditTableTournamentService");
class EditTableTournamentController {
  async handle(req, res) {
    const {
      tournament_id
    } = req.params;
    const {
      type
    } = req.body;
    let club_id = req.club_id;
    const editTableTournamentService = new _EditTableTournamentService.EditTableTournamentService();
    const tournament = await editTableTournamentService.execute({
      tournament_id,
      type,
      club_id
    });
    return res.json(tournament);
  }
}
exports.EditTableTournamentController = EditTableTournamentController;