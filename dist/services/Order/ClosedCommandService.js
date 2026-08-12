"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ClosedCommandService = void 0;
var _prisma = _interopRequireDefault(require("../../prisma"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class ClosedCommandService {
  async execute({
    club_id,
    command_id
  }) {
    if (!command_id || !club_id) {
      throw new Error("Preencha os campos obrigatórios");
    }
    const command = await _prisma.default.command.findFirst({
      where: {
        id: command_id,
        club_id: club_id
      }
    });
    if (!command) {
      throw new Error("Fornecedor não encontrado");
    }
    const commandEdit = await _prisma.default.command.update({
      where: {
        id: command_id
      },
      data: {
        open: false
      }
    });
    return commandEdit;
  }
}
exports.ClosedCommandService = ClosedCommandService;