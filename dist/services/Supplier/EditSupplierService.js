"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EditSupplierService = void 0;
var _prisma = _interopRequireDefault(require("../../prisma"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class EditSupplierService {
  async execute({
    name,
    club_id,
    supplier_id
  }) {
    if (!supplier_id || !name || !club_id) {
      throw new Error("Preencha os campos obrigatórios");
    }
    const supplier = await _prisma.default.supplier.findFirst({
      where: {
        id: supplier_id,
        club_id: club_id
      }
    });
    if (!supplier) {
      throw new Error("Fornecedor não encontrado");
    }
    const supplierEdit = await _prisma.default.supplier.update({
      where: {
        id: supplier_id
      },
      data: {
        name: name
      }
    });
    return supplierEdit;
  }
}
exports.EditSupplierService = EditSupplierService;