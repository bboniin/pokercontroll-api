"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EditChipService = void 0;
var _prisma = _interopRequireDefault(require("../../prisma"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class EditChipService {
  async execute({
    value,
    club_id,
    color,
    chip_id
  }) {
    if (!chip_id || !value || !color || !club_id) {
      throw new Error("Preencha os campos obrigatórios");
    }
    const chip = await _prisma.default.chip.findFirst({
      where: {
        id: chip_id,
        club_id: club_id
      }
    });
    if (!chip) {
      throw new Error("Ficha não encontrada");
    }
    const chipEdit = await _prisma.default.chip.update({
      where: {
        id: chip_id
      },
      data: {
        value: value,
        color: color
      }
    });
    return chipEdit;
  }
}
exports.EditChipService = EditChipService;