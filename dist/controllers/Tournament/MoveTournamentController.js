"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MoveTournamentController = void 0;
var _MoveTournamentService = require("../../services/Tournament/MoveTournamentService");
class MoveTournamentController {
  async handle(req, res) {
    const {
      id,
      chair,
      tournament_id
    } = req.body;
    const moveTournamentService = new _MoveTournamentService.MoveTournamentService();
    const client = await moveTournamentService.execute({
      chair,
      id,
      tournament_id
    });
    if (client["photo"]) {
      client["photo_url"] = "https://pokercontrol-data.s3.sa-east-1.amazonaws.com/" + client["photo"];
    }
    return res.json(client);
  }
}
exports.MoveTournamentController = MoveTournamentController;