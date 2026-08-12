"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DeleteCategoryService = void 0;
var _prisma = _interopRequireDefault(require("../../prisma"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class DeleteCategoryService {
  async execute({
    category_id,
    club_id
  }) {
    const category = await _prisma.default.category.delete({
      where: {
        id: category_id
      }
    });
    return category;
  }
}
exports.DeleteCategoryService = DeleteCategoryService;