"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ListOrdersService = void 0;
var _prisma = _interopRequireDefault(require("../../prisma"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class ListOrdersService {
  async execute({
    club_id,
    page
  }) {
    const ordersTotal = await _prisma.default.order.count({
      where: {
        club_id: club_id
      }
    });
    const orders = await _prisma.default.order.findMany({
      skip: page * 30,
      take: 30,
      where: {
        club_id: club_id
      },
      orderBy: {
        create_at: "desc"
      },
      include: {
        client: true
      }
    });
    return {
      orders,
      ordersTotal
    };
  }
}
exports.ListOrdersService = ListOrdersService;