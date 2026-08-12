"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ListClientsChairController = void 0;
var _ListClientsChairService = require("../../services/Client/ListClientsChairService");
class ListClientsChairController {
  async handle(req, res) {
    const {
      tournament_id,
      cash_id
    } = req.query;
    let club_id = req.club_id;
    const listClientsChairService = new _ListClientsChairService.ListClientsChairService();
    const clients = await listClientsChairService.execute({
      club_id,
      cash_id: cash_id ? String(cash_id) : "",
      tournament_id: tournament_id ? String(tournament_id) : ""
    });
    clients.map(item => {
      if (item["photo"]) {
        item["photo_url"] = "https://pokercontrol-data.s3.sa-east-1.amazonaws.com/" + item["photo"];
      }
    });
    return res.json(clients);
  }
}
exports.ListClientsChairController = ListClientsChairController;