"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ListJackpotController = void 0;
var _ListJackpotService = require("../../services/Transaction/ListJackpotService");
class ListJackpotController {
  async handle(req, res) {
    let {
      page
    } = req.query;
    let club_id = req.club_id;
    const listJackpotService = new _ListJackpotService.ListJackpotService();
    const jackpot = await listJackpotService.execute({
      club_id,
      page: Number(page) > 0 ? Number(page) : 0
    });
    return res.json(jackpot);
  }
}
exports.ListJackpotController = ListJackpotController;