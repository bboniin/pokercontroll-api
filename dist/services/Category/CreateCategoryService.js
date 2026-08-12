"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CreateCategoryService = void 0;
var _prisma = _interopRequireDefault(require("../../prisma"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class CreateCategoryService {
  async execute({
    name,
    club_id
  }) {
    if (!name || !club_id) {
      throw new Error("Preencha os campos obrigatórios");
    }
    const category = await _prisma.default.category.create({
      data: {
        name: name,
        club_id: club_id
      }
    });
    return category;
  }
}
exports.CreateCategoryService = CreateCategoryService;