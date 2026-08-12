"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ListCategoriesController = void 0;
var _ListCategoriesService = require("../../services/Category/ListCategoriesService");
class ListCategoriesController {
  async handle(req, res) {
    let club_id = req.club_id;
    const listCategoriesService = new _ListCategoriesService.ListCategoriesService();
    const categories = await listCategoriesService.execute({
      club_id
    });
    return res.json(categories);
  }
}
exports.ListCategoriesController = ListCategoriesController;