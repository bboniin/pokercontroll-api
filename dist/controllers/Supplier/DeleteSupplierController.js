"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DeleteSupplierController = void 0;
var _DeleteSupplierService = require("../../services/Supplier/DeleteSupplierService");
class DeleteSupplierController {
  async handle(req, res) {
    const {
      supplier_id
    } = req.params;
    let club_id = req.club_id;
    const deleteSupplierService = new _DeleteSupplierService.DeleteSupplierService();
    const supplier = await deleteSupplierService.execute({
      club_id,
      supplier_id
    });
    return res.json(supplier);
  }
}
exports.DeleteSupplierController = DeleteSupplierController;