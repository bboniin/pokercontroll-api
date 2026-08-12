"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.StructureTournamentController = void 0;
var _StructureTournamentService = require("../../services/Tournament/StructureTournamentService");
class StructureTournamentController {
  async handle(req, res) {
    const {
      tournament_id
    } = req.params;
    const {
      name,
      blinds,
      intervals,
      nivel_max_in,
      nivel_max_timechip,
      seconds_ajusted,
      target_tournament_id
    } = req.body;
    let club_id = req.club_id;
    const structureTournamentService = new _StructureTournamentService.StructureTournamentService();
    const tournament = await structureTournamentService.execute({
      name,
      blinds,
      intervals,
      club_id,
      nivel_max_in,
      nivel_max_timechip,
      seconds_ajusted,
      tournament_id,
      target_tournament_id
    });
    return res.json(tournament);
  }
}
exports.StructureTournamentController = StructureTournamentController;