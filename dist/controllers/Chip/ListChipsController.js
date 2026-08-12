"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ListChipsController = void 0;
var _ListChipsService = require("../../services/Chip/ListChipsService");
class ListChipsController {
  async handle(req, res) {
    let club_id = req.club_id;
    const listChipsService = new _ListChipsService.ListChipsService();
    const chips = await listChipsService.execute({
      club_id
    });
    return res.json(chips);
  }
}
exports.ListChipsController = ListChipsController;