"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ListSuppliersController = void 0;
var _ListSuppliersService = require("../../services/Supplier/ListSuppliersService");
class ListSuppliersController {
  async handle(req, res) {
    let club_id = req.club_id;
    const listSuppliersService = new _ListSuppliersService.ListSuppliersService();
    const suppliers = await listSuppliersService.execute({
      club_id
    });
    return res.json(suppliers);
  }
}
exports.ListSuppliersController = ListSuppliersController;