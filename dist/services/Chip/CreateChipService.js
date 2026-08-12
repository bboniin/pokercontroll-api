"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CreateChipService = void 0;
var _prisma = _interopRequireDefault(require("../../prisma"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class CreateChipService {
  async execute({
    value,
    color,
    club_id
  }) {
    if (!value || !color || !club_id) {
      throw new Error("Preencha os campos obrigatórios");
    }
    const chip = await _prisma.default.chip.create({
      data: {
        value: value,
        color: color,
        club_id: club_id
      }
    });
    return chip;
  }
}
exports.CreateChipService = CreateChipService;