"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EditTournamentController = void 0;
var _EditTournamentService = require("../../services/Tournament/EditTournamentService");
class EditTournamentController {
  async handle(req, res) {
    const {
      tournament_id
    } = req.params;
    const {
      name,
      value,
      amount
    } = req.body;
    let photo = "";
    if (req.file) {
      photo = req.file.filename;
    }
    let club_id = req.club_id;
    const editTournamentService = new _EditTournamentService.EditTournamentService();
    const tournament = await editTournamentService.execute({
      name,
      value: value ? parseFloat(value) : 0,
      amount: amount ? parseFloat(amount) : 0,
      photo,
      club_id,
      tournament_id
    });
    return res.json(tournament);
  }
}
exports.EditTournamentController = EditTournamentController;