"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ListPassportController = void 0;
var _ListPassportService = require("../../services/Transaction/ListPassportService");
class ListPassportController {
  async handle(req, res) {
    let {
      page
    } = req.query;
    let club_id = req.club_id;
    const listPassportService = new _ListPassportService.ListPassportService();
    const passport = await listPassportService.execute({
      club_id,
      page: Number(page) > 0 ? Number(page) : 0
    });
    return res.json(passport);
  }
}
exports.ListPassportController = ListPassportController;