"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GetCommandService = void 0;
var _prisma = _interopRequireDefault(require("../../prisma"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class GetCommandService {
  async execute({
    command_id,
    club_id
  }) {
    const command = await _prisma.default.command.findFirst({
      where: {
        id: command_id,
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
    return command;
  }
}
exports.GetCommandService = GetCommandService;