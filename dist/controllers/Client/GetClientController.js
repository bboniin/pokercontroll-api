"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GetClientController = void 0;
var _GetClientService = require("../../services/Client/GetClientService");
class GetClientController {
  async handle(req, res) {
    const {
      client_id
    } = req.params;
    const {
      page
    } = req.query;
    let club_id = req.club_id;
    const getClientService = new _GetClientService.GetClientService();
    const {
      client,
      transactionsTotal
    } = await getClientService.execute({
      club_id,
      client_id,
      page: Number(page) > 0 ? Number(page) : 0
    });
    if (client["photo"]) {
      client["photo_url"] = "https://pokercontrol-data.s3.sa-east-1.amazonaws.com/" + client["photo"];
    }
    return res.json({
      client,
      transactionsTotal
    });
  }
}
exports.GetClientController = GetClientController;