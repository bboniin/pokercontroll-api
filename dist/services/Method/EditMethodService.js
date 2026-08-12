"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EditMethodService = void 0;
var _prisma = _interopRequireDefault(require("../../prisma"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class EditMethodService {
  async execute({
    name,
    club_id,
    percentage,
    identifier,
    method_id
  }) {
    if (!method_id || !name || !club_id) {
      throw new Error("Preencha os campos obrigatórios");
    }
    const method = await _prisma.default.method.findFirst({
      where: {
        id: method_id,
        club_id: club_id
      }
    });
    if (!method) {
      throw new Error("Método de pagamento não encontrado");
    }
    const methodEdit = await _prisma.default.method.update({
      where: {
        id: method_id
      },
      data: {
        percentage: percentage,
        identifier: identifier,
        name: name
      }
    });
    return methodEdit;
  }
}
exports.EditMethodService = EditMethodService;