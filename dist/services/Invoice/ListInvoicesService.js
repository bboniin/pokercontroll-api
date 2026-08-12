"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ListInvoicesService = void 0;
var _prisma = _interopRequireDefault(require("../../prisma"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class ListInvoicesService {
  async execute({
    club_id
  }) {
    const invoices = await _prisma.default.invoice.findMany({
      where: {
        club_id: club_id
      },
      orderBy: {
        create_at: "asc"
      }
    });
    return invoices;
  }
}
exports.ListInvoicesService = ListInvoicesService;