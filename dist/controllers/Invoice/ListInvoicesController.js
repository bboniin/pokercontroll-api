"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ListInvoicesController = void 0;
var _ListInvoicesService = require("../../services/Invoice/ListInvoicesService");
class ListInvoicesController {
  async handle(req, res) {
    let club_id = req.club_id;
    const listInvoicesService = new _ListInvoicesService.ListInvoicesService();
    const invoices = await listInvoicesService.execute({
      club_id
    });
    return res.json(invoices);
  }
}
exports.ListInvoicesController = ListInvoicesController;