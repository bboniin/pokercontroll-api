"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CreateInvoiceService = void 0;
var _prisma = _interopRequireDefault(require("../../prisma"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class CreateInvoiceService {
  async execute({
    products,
    club_id,
    identifier,
    observation,
    supplier_id
  }) {
    if (!club_id || !supplier_id || !identifier || products.length == 0) {
      throw new Error("Preencha os campos obrigatórios");
    }
    let whereProdutcs = {
      OR: []
    };
    let value_total = 0;
    let amount_total = 0;
    products.map((item, index) => {
      item["amount"] = item["amount"] ? parseInt(item["amount"]) : 0;
      item["cost_value"] = item["cost_value"] ? parseFloat(item["cost_value"]) : 0;
      value_total += item["amount"] * item["cost_value"];
      amount_total += item["amount"];
      if (!item["amount"] || !item["product_id"]) {
        throw new Error(`Preencha os campos obrigatórios do produto ${index + 1}`);
      }
      whereProdutcs.OR.push({
        id: item["product_id"],
        club_id: club_id
      });
    });
    const productsWhere = await _prisma.default.product.findMany({
      where: whereProdutcs
    });
    if (products.length != productsWhere.length) {
      throw new Error("Algum dos produtos não foi encontrado");
    }
    const invoice = await _prisma.default.invoice.create({
      data: {
        value: value_total,
        amount: amount_total,
        club_id: club_id,
        identifier: identifier,
        observation: observation,
        supplier_id: supplier_id
      }
    });
    products.map(async item => {
      let [productWhere] = productsWhere.filter(data => data.id == item["product_id"]);
      await _prisma.default.product.update({
        where: {
          id: item["product_id"]
        },
        data: {
          amount: productWhere.amount + item["amount"]
        }
      });
      await _prisma.default.stock.create({
        data: {
          name: productWhere.name,
          amount: item["amount"],
          club_id: club_id,
          cost_value: item["cost_value"],
          invoice_id: invoice.id
        }
      });
    });
    return invoice;
  }
}
exports.CreateInvoiceService = CreateInvoiceService;