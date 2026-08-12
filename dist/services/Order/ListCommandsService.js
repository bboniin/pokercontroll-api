"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ListCommandsService = void 0;
var _prisma = _interopRequireDefault(require("../../prisma"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class ListCommandsService {
  async execute({
    club_id,
    page
  }) {
    const commandsTotal = await _prisma.default.command.count({
      where: {
        club_id: club_id
      }
    });
    const commands = await _prisma.default.command.findMany({
      skip: page * 30,
      take: 30,
      where: {
        club_id: club_id
      },
      orderBy: {
        create_at: "desc"
      },
      include: {
        client: true,
        orders: true,
        products_order: true
      }
    });
    commands.sort(function (a, b) {
      return a.open ? -1 : 1;
    });
    return {
      commands,
      commandsTotal
    };
  }
}
exports.ListCommandsService = ListCommandsService;