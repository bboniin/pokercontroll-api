"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ListMethodsController = void 0;
var _ListMethodsService = require("../../services/Method/ListMethodsService");
class ListMethodsController {
  async handle(req, res) {
    let {
      page,
      all
    } = req.query;
    let club_id = req.club_id;
    const listMethodsService = new _ListMethodsService.ListMethodsService();
    const methods = await listMethodsService.execute({
      club_id,
      page: Number(page) > 0 ? Number(page) : 0,
      all: all == "true" ? true : false
    });
    return res.json(methods);
  }
}
exports.ListMethodsController = ListMethodsController;