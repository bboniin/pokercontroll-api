"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ListSuppliersService = void 0;
var _prisma = _interopRequireDefault(require("../../prisma"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class ListSuppliersService {
  async execute({
    club_id
  }) {
    const suppliers = await _prisma.default.supplier.findMany({
      where: {
        club_id: club_id,
        active: true
      },
      orderBy: {
        create_at: "asc"
      }
    });
    return suppliers;
  }
}
exports.ListSuppliersService = ListSuppliersService;