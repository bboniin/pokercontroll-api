"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ClientsTournamentController = void 0;
var _ClientsTournamentService = require("../../services/Tournament/ClientsTournamentService");
class ClientsTournamentController {
  async handle(req, res) {
    const {
      tournament_id
    } = req.params;
    let club_id = req.club_id;
    const clientsTournamentService = new _ClientsTournamentService.ClientsTournamentService();
    const clients = await clientsTournamentService.execute({
      club_id,
      tournament_id
    });
    clients.map(item => {
      if (item["photo"]) {
        item["photo_url"] = "https://pokercontrol-data.s3.sa-east-1.amazonaws.com/" + item["photo"];
      }
    });
    return res.json(clients);
  }
}
exports.ClientsTournamentController = ClientsTournamentController;