"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ClientsExitTournamentController = void 0;
var _ClientsExitTournamentService = require("../../services/Tournament/ClientsExitTournamentService");
class ClientsExitTournamentController {
  async handle(req, res) {
    const {
      tournament_id
    } = req.params;
    let club_id = req.club_id;
    const clientsExitTournamentService = new _ClientsExitTournamentService.ClientsExitTournamentService();
    const clientsExit = await clientsExitTournamentService.execute({
      club_id,
      tournament_id
    });
    clientsExit.map(item => {
      if (item["photo"]) {
        item["photo_url"] = "https://pokercontrol-data.s3.sa-east-1.amazonaws.com/" + item["photo"];
      }
    });
    return res.json(clientsExit);
  }
}
exports.ClientsExitTournamentController = ClientsExitTournamentController;