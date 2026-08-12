"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ListBanksController = void 0;
var _ListBanksService = require("../../services/Bank/ListBanksService");
class ListBanksController {
  async handle(req, res) {
    let club_id = req.club_id;
    const listBanksService = new _ListBanksService.ListBanksService();
    const banks = await listBanksService.execute({
      club_id
    });
    return res.json(banks);
  }
}
exports.ListBanksController = ListBanksController;