"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EditCategoryService = void 0;
var _prisma = _interopRequireDefault(require("../../prisma"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class EditCategoryService {
  async execute({
    name,
    club_id,
    category_id
  }) {
    if (!category_id || !name || !club_id) {
      throw new Error("Preencha os campos obrigatórios");
    }
    const category = await _prisma.default.category.findFirst({
      where: {
        id: category_id,
        club_id: club_id
      }
    });
    if (!category) {
      throw new Error("Categoria não encontrada");
    }
    const categoryEdit = await _prisma.default.category.update({
      where: {
        id: category_id
      },
      data: {
        name: name
      }
    });
    return categoryEdit;
  }
}
exports.EditCategoryService = EditCategoryService;