"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ClientsCashController = void 0;
var _ClientsCashService = require("../../services/Cash/ClientsCashService");
class ClientsCashController {
  async handle(req, res) {
    let club_id = req.club_id;
    const {
      cash_id
    } = req.params;
    const clientsCashService = new _ClientsCashService.ClientsCashService();
    const clients = await clientsCashService.execute({
      club_id,
      cash_id: cash_id
    });
    clients.map(item => {
      if (item["photo"]) {
        item["photo_url"] = "https://pokercontrol-data.s3.sa-east-1.amazonaws.com/" + item["photo"];
      }
    });
    return res.json(clients);
  }
}
exports.ClientsCashController = ClientsCashController;