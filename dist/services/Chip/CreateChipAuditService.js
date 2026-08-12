"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CreateChipAuditService = void 0;
var _prisma = _interopRequireDefault(require("../../prisma"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class CreateChipAuditService {
  async execute({
    chips_value,
    briefcase_value,
    cash_id,
    club_id
  }) {
    if (!cash_id || !chips_value || !briefcase_value || !club_id) {
      throw new Error("Preencha os campos obrigatórios");
    }
    const chipAudit = await _prisma.default.chipAudit.create({
      data: {
        briefcase_value: briefcase_value,
        chips_value: chips_value,
        cash_id: cash_id
      }
    });
    return chipAudit;
  }
}
exports.CreateChipAuditService = CreateChipAuditService;