"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MoveCashController = void 0;
var _MoveCashService = require("../../services/Cash/MoveCashService");
class MoveCashController {
  async handle(req, res) {
    const {
      id,
      chair,
      cash_id
    } = req.body;
    let club_id = req.club_id;
    const moveCashService = new _MoveCashService.MoveCashService();
    const client = await moveCashService.execute({
      chair,
      id,
      club_id,
      cash_id
    });
    if (client["photo"]) {
      client["photo_url"] = "https://pokercontrol-data.s3.sa-east-1.amazonaws.com/" + client["photo"];
    }
    return res.json(client);
  }
}
exports.MoveCashController = MoveCashController;