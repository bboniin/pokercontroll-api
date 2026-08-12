"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DeleteCategoryController = void 0;
var _DeleteCategoryService = require("../../services/Category/DeleteCategoryService");
class DeleteCategoryController {
  async handle(req, res) {
    const {
      category_id
    } = req.params;
    let club_id = req.club_id;
    const deleteCategoryService = new _DeleteCategoryService.DeleteCategoryService();
    const category = await deleteCategoryService.execute({
      club_id,
      category_id
    });
    return res.json(category);
  }
}
exports.DeleteCategoryController = DeleteCategoryController;