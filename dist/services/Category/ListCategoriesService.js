"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ListCategoriesService = void 0;
var _prisma = _interopRequireDefault(require("../../prisma"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class ListCategoriesService {
  async execute({
    club_id
  }) {
    const categories = await _prisma.default.category.findMany({
      where: {
        club_id: club_id
      },
      orderBy: {
        create_at: "asc"
      }
    });
    return categories;
  }
}
exports.ListCategoriesService = ListCategoriesService;