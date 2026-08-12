"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ListProductsService = void 0;
var _prisma = _interopRequireDefault(require("../../prisma"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class ListProductsService {
  async execute({
    club_id,
    page,
    all
  }) {
    let filter = {};
    if (!all) {
      filter = {
        skip: page * 30,
        take: 30
      };
    }
    const productsTotal = await _prisma.default.product.count({
      where: {
        club_id: club_id
      }
    });
    const products = await _prisma.default.product.findMany({
      ...filter,
      where: {
        club_id: club_id
      },
      orderBy: {
        create_at: "asc"
      },
      include: {
        category: true
      }
    });
    return {
      products,
      productsTotal
    };
  }
}
exports.ListProductsService = ListProductsService;