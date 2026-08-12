"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DeleteSupplierService = void 0;
var _prisma = _interopRequireDefault(require("../../prisma"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class DeleteSupplierService {
  async execute({
    supplier_id,
    club_id
  }) {
    const supplier = await _prisma.default.supplier.update({
      where: {
        id: supplier_id
      },
      data: {
        active: false
      }
    });
    return supplier;
  }
}
exports.DeleteSupplierService = DeleteSupplierService;