"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CreateSupplierController = void 0;
var _CreateSupplierService = require("../../services/Supplier/CreateSupplierService");
class CreateSupplierController {
  async handle(req, res) {
    const {
      name
    } = req.body;
    let club_id = req.club_id;
    const createSupplierService = new _CreateSupplierService.CreateSupplierService();
    const supplier = await createSupplierService.execute({
      name,
      club_id
    });
    return res.json(supplier);
  }
}
exports.CreateSupplierController = CreateSupplierController;