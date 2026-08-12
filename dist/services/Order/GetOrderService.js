"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GetOrderService = void 0;
var _prisma = _interopRequireDefault(require("../../prisma"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class GetOrderService {
  async execute({
    order_id,
    club_id
  }) {
    const order = await _prisma.default.order.findFirst({
      where: {
        id: order_id,
        club_id: club_id
      },
      orderBy: {
        create_at: "asc"
      },
      include: {
        client: true,
        products_order: true
      }
    });
    return order;
  }
}
exports.GetOrderService = GetOrderService;