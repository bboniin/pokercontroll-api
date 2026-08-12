"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DeleteChipService = void 0;
var _prisma = _interopRequireDefault(require("../../prisma"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class DeleteChipService {
  async execute({
    chip_id,
    club_id
  }) {
    const chip = await _prisma.default.chip.delete({
      where: {
        id: chip_id
      }
    });
    return chip;
  }
}
exports.DeleteChipService = DeleteChipService;