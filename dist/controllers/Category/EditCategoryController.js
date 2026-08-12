"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EditCategoryController = void 0;
var _EditCategoryService = require("../../services/Category/EditCategoryService");
class EditCategoryController {
  async handle(req, res) {
    const {
      category_id
    } = req.params;
    const {
      name
    } = req.body;
    let club_id = req.club_id;
    const editCategoryService = new _EditCategoryService.EditCategoryService();
    const category = await editCategoryService.execute({
      name,
      club_id,
      category_id
    });
    return res.json(category);
  }
}
exports.EditCategoryController = EditCategoryController;