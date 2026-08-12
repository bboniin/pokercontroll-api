"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CreateOrderService = void 0;
var _prisma = _interopRequireDefault(require("../../prisma"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class CreateOrderService {
  async execute({
    club_id,
    value,
    observation,
    client_id,
    items
  }) {
    if (!value || !items || !club_id) {
      throw new Error("Preencha os campos obrigatórios");
    }
    let command = await _prisma.default.command.findFirst({
      where: {
        client_id: client_id,
        open: true
      }
    });
    if (!command) {
      command = await _prisma.default.command.create({
        data: {
          club_id: club_id,
          client_id: client_id
        }
      });
    }
    const order = await _prisma.default.order.create({
      data: {
        value: value,
        observation: observation,
        club_id: club_id,
        client_id: client_id,
        command_id: command.id
      },
      include: {
        client: true
      }
    });
    order["items"] = [];
    items.map(async data => {
      const itemOrder = await _prisma.default.productOrder.create({
        data: {
          amount: data["total"],
          order_id: order.id,
          name: data["name"],
          value: data["value"],
          command_id: command.id
        }
      });
      order["items"].push(itemOrder);
    });
    return order;
  }
}
exports.CreateOrderService = CreateOrderService;