"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ListTournamentsController = void 0;
var _ListTournamentsService = require("../../services/Tournament/ListTournamentsService");
class ListTournamentsController {
  async handle(req, res) {
    let {
      page,
      all
    } = req.query;
    let club_id = req.club_id;
    const listTournamentsService = new _ListTournamentsService.ListTournamentsService();
    const tournaments = await listTournamentsService.execute({
      club_id,
      page: Number(page) > 0 ? Number(page) : 0,
      all: all == "true" ? true : false
    });
    return res.json(tournaments);
  }
}
exports.ListTournamentsController = ListTournamentsController;