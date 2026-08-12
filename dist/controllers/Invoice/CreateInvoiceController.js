"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CreateInvoiceController = void 0;
var _CreateInvoiceService = require("../../services/Invoice/CreateInvoiceService");
var _CreateTransactionClubeService = require("../../services/Transaction/CreateTransactionClubeService");
class CreateInvoiceController {
  async handle(req, res) {
    const {
      supplier_id,
      products,
      methods_transaction,
      identifier,
      observation,
      datePayment
    } = req.body;
    let club_id = req.club_id;
    let user_id = req.user_id;
    const createInvoiceService = new _CreateInvoiceService.CreateInvoiceService();
    const invoice = await createInvoiceService.execute({
      products,
      supplier_id,
      club_id,
      identifier,
      observation
    });
    const createTransactionClubeService = new _CreateTransactionClubeService.CreateTransactionClubeService();
    let valueCredit = methods_transaction.filter(item => item["id"] == "Crédito").length != 0 ? methods_transaction.filter(item => item["id"] == "Crédito")[0].value : 0;
    await createTransactionClubeService.execute({
      paid: valueCredit ? false : true,
      value: invoice.value,
      type: "clube",
      methods_transaction,
      items_transaction: {
        name: `Estoque`,
        amount: invoice.amount,
        value: invoice.value
      },
      club_id,
      date_payment: datePayment,
      observation: observation,
      operation: "saida",
      valueReceive: 0,
      valueDebit: 0,
      user_id
    });
    return res.json(invoice);
  }
}
exports.CreateInvoiceController = CreateInvoiceController;