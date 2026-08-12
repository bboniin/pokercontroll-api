"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CreateCategoryController = void 0;
var _CreateCategoryService = require("../../services/Category/CreateCategoryService");
class CreateCategoryController {
  async handle(req, res) {
    const {
      name
    } = req.body;
    let club_id = req.club_id;
    const createCategoryService = new _CreateCategoryService.CreateCategoryService();
    const category = await createCategoryService.execute({
      name,
      club_id
    });
    return res.json(category);
  }
}
exports.CreateCategoryController = CreateCategoryController;