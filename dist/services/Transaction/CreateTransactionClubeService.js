"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CreateTransactionClubeService = void 0;
var _prisma = _interopRequireDefault(require("../../prisma"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const typesTransaction = {
  clube: true,
  jackpot: true,
  passport: true,
  dealer: true
};
class CreateTransactionClubeService {
  async execute({
    type,
    value,
    club_id,
    paid,
    valueReceive,
    valueDebit,
    methods_transaction,
    items_transaction,
    operation,
    date_payment,
    observation,
    user_id
  }) {
    const club = await _prisma.default.club.findUnique({
      where: {
        id: club_id
      }
    });
    if (!type || !operation) {
      throw new Error("Tipo, operação é obrigatório");
    }
    if (operation != "entrada" && operation != "saida") {
      throw new Error("Apenas entradas e saidas são aceitos");
    }
    if (!typesTransaction[type]) {
      throw new Error("Tipo de transação é inválido");
    }
    let methodsPay = methods_transaction.filter(item => item["id"] != "Crédito" && item["id"] != "Pag Dívida" && item["id"] != "Saldo");
    let valuePaid = methodsPay.length ? methodsPay.map(method => method["value"]).reduce((total, value) => total + value) : 0;
    let valueMethods = methodsPay.length ? methodsPay.map(method => method["value"] * ((100 - method["percentage"]) / 100)).reduce((total, value) => total + value) : 0;
    if (paid) {
      date_payment = new Date();
    }
    let transaction = null;
    let updateBalance = null;
    if (type == "clube") {
      if (operation == "entrada") {
        updateBalance = {
          balance: parseFloat((club.balance + valueMethods).toFixed(2))
        };
      } else {
        updateBalance = {
          balance: parseFloat((club.balance - valuePaid).toFixed(2))
        };
      }
    }
    if (type == "passport") {
      if (operation == "entrada") {
        updateBalance = {
          passport: parseFloat((club.passport + valueMethods).toFixed(2))
        };
      } else {
        updateBalance = {
          passport: parseFloat((club.passport - valuePaid).toFixed(2))
        };
      }
    }
    if (type == "dealer") {
      if (operation == "entrada") {
        updateBalance = {
          dealer: parseFloat((club.dealer + valueMethods).toFixed(2))
        };
      } else {
        updateBalance = {
          dealer: parseFloat((club.dealer - valuePaid).toFixed(2))
        };
      }
    }
    if (type == "jackpot") {
      if (operation == "entrada") {
        updateBalance = {
          jackpot: parseFloat((club.jackpot + valueMethods).toFixed(2))
        };
      } else {
        updateBalance = {
          jackpot: parseFloat((club.jackpot + valuePaid).toFixed(2))
        };
      }
    }
    if (operation == "entrada") {
      transaction = await _prisma.default.transaction.create({
        data: {
          type: type,
          value: value,
          club_id: club_id,
          operation: operation,
          date_payment: date_payment,
          observation: observation,
          paid: paid,
          user_id: user_id,
          value_paid: valuePaid + valueReceive + valueDebit
        }
      });
      if (value) {
        await _prisma.default.club.update({
          where: {
            id: club_id
          },
          data: updateBalance
        });
      }
    } else {
      transaction = await _prisma.default.transaction.create({
        data: {
          type: type,
          value: value,
          club_id: club_id,
          operation: operation,
          date_payment: date_payment,
          observation: observation,
          paid: paid,
          user_id: user_id,
          value_paid: valuePaid + valueReceive + valueDebit
        }
      });
      if (value) {
        await _prisma.default.club.update({
          where: {
            id: club_id
          },
          data: updateBalance
        });
      }
    }
    methods_transaction.map(async item => {
      if (item["id"] != "Crédito" && item["value"]) {
        if (item["id"] != "Pag Dívida" && item["id"] != "Saldo") {
          const method = await _prisma.default.method.findFirst({
            where: {
              id: item["id"]
            }
          });
          let balance = operation == "entrada" ? method["balance"] + item["value"] * ((100 - item["percentage"]) / 100) : method["balance"] - item["value"] * ((100 - item["percentage"]) / 100);
          await _prisma.default.method.update({
            where: {
              id: item["id"]
            },
            data: {
              balance: balance
            }
          });
        }
        await _prisma.default.methodsTransaction.create({
          data: {
            name: item["name"],
            percentage: item["percentage"],
            value: item["value"],
            transaction_id: transaction.id,
            method_id: item["id"] || "",
            user_id
          }
        });
      }
    });
    await _prisma.default.itemsTransaction.create({
      data: {
        name: items_transaction["name"],
        value: items_transaction["value"],
        amount: items_transaction["amount"],
        product_id: items_transaction["product_id"] || "",
        transaction_id: transaction.id
      }
    });
    return transaction;
  }
}
exports.CreateTransactionClubeService = CreateTransactionClubeService;