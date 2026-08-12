"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CreateTransactionService = void 0;
var _prisma = _interopRequireDefault(require("../../prisma"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class CreateTransactionService {
  async execute({
    type,
    sector_id,
    value,
    valueReceive,
    valueDebit,
    club_id,
    paid,
    client_id,
    methods_transaction,
    items_transaction,
    operation,
    date_payment,
    observation,
    user_id
  }, tx) {
    const prisma = tx || _prisma.default;
    const client = await prisma.client.findFirst({
      where: {
        id: client_id,
        club_id: club_id
      }
    });
    const club = await prisma.club.findUnique({
      where: {
        id: club_id
      }
    });
    if (!client) {
      throw new Error("Cliente não encontrado");
    }
    if (!type || !client_id || !operation) {
      throw new Error("Tipo, operação e id do cliente é obrigatório");
    }
    if (operation != "entrada" && operation != "saida") {
      throw new Error("Apenas entradas e saidas são aceitos");
    }
    if (type != "clube") {
      throw new Error("Tipo de transação é inválido");
    }
    let methodsPay = methods_transaction.filter(item => item["id"] != "Crédito" && item["id"] != "Pag Dívida" && item["id"] != "Saldo");
    let valuePaid = methodsPay.length ? methodsPay.map(method => method["value"]).reduce((total, value) => total + value) : 0;
    let valueMethods = methodsPay.length ? methodsPay.map(method => method["value"] * ((100 - method["percentage"]) / 100)).reduce((total, value) => total + value) : 0;
    if (paid) {
      date_payment = new Date();
    }
    let transaction = null;
    if (operation == "entrada") {
      transaction = await prisma.transaction.create({
        data: {
          type: type,
          value: value,
          client_id: client_id,
          club_id: club_id,
          sector_id: sector_id,
          operation: operation,
          date_payment: date_payment,
          observation: observation,
          paid: paid,
          user_id: user_id,
          value_paid: valuePaid + valueReceive + valueDebit
        }
      });
      if (value) {
        await prisma.club.update({
          where: {
            id: club_id
          },
          data: {
            balance: parseFloat((club.balance + valueMethods).toFixed(2))
          }
        });
      }
    } else {
      transaction = await prisma.transaction.create({
        data: {
          type: type,
          value: value,
          client_id: client_id,
          club_id: club_id,
          sector_id: sector_id,
          operation: operation,
          date_payment: date_payment,
          observation: observation,
          paid: paid,
          user_id: user_id,
          value_paid: valuePaid + valueReceive + valueDebit
        }
      });
      if (value) {
        await prisma.club.update({
          where: {
            id: club_id
          },
          data: {
            balance: parseFloat((club.balance - valuePaid).toFixed(2))
          }
        });
      }
    }
    await Promise.all(items_transaction.map(async item => {
      await prisma.itemsTransaction.create({
        data: {
          name: item["name"],
          value: item["value"],
          type: item["type"] || "",
          product_id: item["product_id"] || "",
          amount: item["amount"],
          transaction_id: transaction.id
        }
      });
    }));
    await Promise.all(methods_transaction.map(async item => {
      if (item["id"] != "Crédito" && item["value"]) {
        if (item["id"] != "Pag Dívida" && item["id"] != "Saldo") {
          const method = await prisma.method.findFirst({
            where: {
              id: item["id"]
            }
          });
          let balance = operation == "entrada" ? method["balance"] + item["value"] * ((100 - item["percentage"]) / 100) : method["balance"] - item["value"] * ((100 - item["percentage"]) / 100);
          await prisma.method.update({
            where: {
              id: item["id"]
            },
            data: {
              balance: balance
            }
          });
        }
        await prisma.methodsTransaction.create({
          data: {
            name: item["name"],
            percentage: item["percentage"],
            value: item["value"],
            transaction_id: transaction.id,
            method_id: item["method_id"] || item["id"] || "",
            user_id
          }
        });
      }
    }));
    return transaction;
  }
}
exports.CreateTransactionService = CreateTransactionService;