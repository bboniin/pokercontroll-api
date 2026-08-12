"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CreateOrderController = void 0;
var _CreateTransactionService = require("../../services/Transaction/CreateTransactionService");
var _CreateOrderService = require("../../services/Order/CreateOrderService");
var _VerifyProductService = require("../../services/Product/VerifyProductService");
var _OrderTransactionService = require("../../services/Transaction/OrderTransactionService");
var _DiscoutProductService = require("../../services/Product/DiscoutProductService");
var _VerifyCreditTransactionService = require("../../services/Transaction/VerifyCreditTransactionService");
var _PaymentReceivesService = require("../../services/Transaction/PaymentReceivesService");
class CreateOrderController {
  async handle(req, res) {
    const {
      items,
      methods_transaction,
      client_id,
      date_payment,
      observation
    } = req.body;
    let club_id = req.club_id;
    let user_id = req.user_id;
    const verifyProductService = new _VerifyProductService.VerifyProductService();
    await verifyProductService.execute({
      items
    });
    let value = 0;
    items.map(item => {
      value += item.total * item.value;
    });
    let valueCredit = methods_transaction.filter(item => item["id"] == "Crédito").length != 0 ? methods_transaction.filter(item => item["id"] == "Crédito")[0].value : 0;
    if (valueCredit) {
      const verifyCreditTransactionService = new _VerifyCreditTransactionService.VerifyCreditTransactionService();
      await verifyCreditTransactionService.execute({
        client_id,
        club_id,
        value: valueCredit,
        club: false
      });
    }
    let valueReceive = methods_transaction.filter(item => item["id"] == "Saldo").length != 0 ? methods_transaction.filter(item => item["id"] == "Saldo")[0].value : 0;
    const paymentReceivesService = new _PaymentReceivesService.PaymentReceivesService();
    if (valueReceive) {
      await paymentReceivesService.execute({
        value: valueReceive,
        client_id,
        club_id,
        confirm: false,
        user_id
      });
    }
    const createTransactionService = new _CreateTransactionService.CreateTransactionService();
    const transaction = await createTransactionService.execute({
      paid: valueReceive == value ? true : valueCredit ? false : true,
      value,
      type: "clube",
      methods_transaction: methods_transaction,
      items_transaction: [{
        name: "bar",
        amount: 1,
        value: value
      }],
      client_id,
      sector_id: "",
      club_id,
      date_payment,
      observation,
      operation: "entrada",
      valueReceive,
      valueDebit: 0,
      user_id
    });
    const createOrderService = new _CreateOrderService.CreateOrderService();
    const order = await createOrderService.execute({
      items: items,
      value,
      observation,
      club_id,
      client_id
    });
    const orderTransactionService = new _OrderTransactionService.OrderTransactionService();
    await orderTransactionService.execute({
      id: transaction["id"],
      club_id: club_id,
      sector_id: order["id"]
    });
    const discoutProductService = new _DiscoutProductService.DiscoutProductService();
    await discoutProductService.execute({
      items
    });
    if (order["client"]["photo"]) {
      order["client"]["photo_url"] = "https://pokercontrol-data.s3.sa-east-1.amazonaws.com/" + order["client"]["photo"];
    }
    return res.json(order);
  }
}
exports.CreateOrderController = CreateOrderController;