"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ListClubsController = void 0;
var _ListClubsService = require("../../services/Club/ListClubsService");
class ListClubsController {
  async handle(req, res) {
    let {
      page,
      all
    } = req.query;
    const user_id = req.user_id;
    const listClubsService = new _ListClubsService.ListClubsService();
    const clubs = await listClubsService.execute({
      user_id,
      page: Number(page) > 0 ? Number(page) : 0,
      all: all == "true" ? true : false
    });
    return res.json(clubs);
  }
}
exports.ListClubsController = ListClubsController;