"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ListClientsController = void 0;
var _ListClientsService = require("../../services/Client/ListClientsService");
class ListClientsController {
  async handle(req, res) {
    let {
      page,
      all,
      search
    } = req.query;
    let club_id = req.club_id;
    const listClientsService = new _ListClientsService.ListClientsService();
    const {
      clients,
      clientsTotal
    } = await listClientsService.execute({
      club_id,
      page: Number(page) > 0 ? Number(page) : 0,
      all: all == "true" ? true : false,
      search: search ? String(search) : ""
    });
    clients.map(item => {
      if (item["photo"]) {
        item["photo_url"] = "https://pokercontrol-data.s3.sa-east-1.amazonaws.com/" + item["photo"];
      }
    });
    return res.json({
      clients,
      clientsTotal
    });
  }
}
exports.ListClientsController = ListClientsController;