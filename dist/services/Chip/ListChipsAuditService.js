"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ListChipsAuditService = void 0;
var _prisma = _interopRequireDefault(require("../../prisma"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class ListChipsAuditService {
  async execute({
    cash_id
  }) {
    const chips = await _prisma.default.chipAudit.findMany({
      where: {
        cash_id: cash_id
      },
      orderBy: {
        create_at: "asc"
      }
    });
    return chips;
  }
}
exports.ListChipsAuditService = ListChipsAuditService;