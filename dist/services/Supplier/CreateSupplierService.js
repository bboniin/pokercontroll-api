"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CreateSupplierService = void 0;
var _prisma = _interopRequireDefault(require("../../prisma"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class CreateSupplierService {
  async execute({
    name,
    club_id
  }) {
    if (!name || !club_id) {
      throw new Error("Preencha os campos obrigatórios");
    }
    const supplier = await _prisma.default.supplier.create({
      data: {
        name: name,
        club_id: club_id
      }
    });
    return supplier;
  }
}
exports.CreateSupplierService = CreateSupplierService;