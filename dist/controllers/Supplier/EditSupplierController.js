"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EditSupplierController = void 0;
var _EditSupplierService = require("../../services/Supplier/EditSupplierService");
class EditSupplierController {
  async handle(req, res) {
    const {
      supplier_id
    } = req.params;
    const {
      name
    } = req.body;
    let club_id = req.club_id;
    const editSupplierService = new _EditSupplierService.EditSupplierService();
    const supplier = await editSupplierService.execute({
      name,
      club_id,
      supplier_id
    });
    return res.json(supplier);
  }
}
exports.EditSupplierController = EditSupplierController;