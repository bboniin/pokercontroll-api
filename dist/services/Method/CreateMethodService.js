"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CreateMethodService = void 0;
var _prisma = _interopRequireDefault(require("../../prisma"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class CreateMethodService {
  async execute({
    name,
    club_id,
    percentage,
    identifier
  }) {
    if (!name || !club_id) {
      throw new Error("Preencha os campos obrigatórios");
    }
    const method = await _prisma.default.method.create({
      data: {
        percentage: percentage,
        name: name,
        identifier: identifier,
        club_id: club_id,
        balance: 0
      }
    });
    return method;
  }
}
exports.CreateMethodService = CreateMethodService;