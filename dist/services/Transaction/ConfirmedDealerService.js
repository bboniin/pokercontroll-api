"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ConfirmedDealerService = void 0;
var _prisma = _interopRequireDefault(require("../../prisma"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class ConfirmedDealerService {
  async execute({
    id,
    club_id,
    valueCredit,
    valueDebit,
    valueReceive,
    date_payment,
    observation,
    methods_transaction,
    user_id
  }) {
    if (!club_id || !id || methods_transaction.length == 0) {
      throw new Error("id da cobrança, método de pagamento e do clube é obrigatório");
    }
    const transaction = await _prisma.default.transaction.findFirst({
      where: {
        id: id
      }
    });
    if (!transaction) {
      throw new Error("Transação não encontrada");
    }
    let client = {};
    if (transaction.client_id) {
      client = await _prisma.default.client.findFirst({
        where: {
          id: transaction.client_id
        }
      });
    }
    const club = await _prisma.default.club.findFirst({
      where: {
        id: club_id
      }
    });
    let methodsPay = methods_transaction.filter(item => item["id"] != "Crédito" && item["id"] != "Pag Dívida" && item["id"] != "Saldo");
    let valuePaid = methodsPay.length ? methodsPay.map(method => method["value"]).reduce((total, value) => total + value) : 0;
    let valueMethods = methodsPay.length ? methodsPay.map(method => method["value"] * ((100 - method["percentage"]) / 100)).reduce((total, value) => total + value) : 0;
    if (!valueCredit) {
      date_payment = new Date();
    }
    await _prisma.default.transaction.update({
      where: {
        id: id
      },
      data: {
        date_payment: date_payment,
        observation: observation,
        paid: valueCredit ? false : true,
        value_paid: transaction.value_paid + valuePaid + valueDebit + valueReceive
      }
    });
    if (transaction.operation == "entrada") {
      await _prisma.default.club.update({
        where: {
          id: club_id
        },
        data: {
          dealer: parseFloat((club.dealer + valueMethods).toFixed(2))
        }
      });
      if (transaction.client_id) {
        await _prisma.default.client.update({
          where: {
            id: client["id"]
          },
          data: {
            debt: parseFloat((client["debt"] - valuePaid).toFixed(2))
          }
        });
      }
    } else {
      await _prisma.default.club.update({
        where: {
          id: club_id
        },
        data: {
          dealer: parseFloat((club.dealer - valuePaid).toFixed(2))
        }
      });
      if (transaction.client_id) {
        await _prisma.default.client.update({
          where: {
            id: client["id"]
          },
          data: {
            receive: parseFloat((client["receive"] - valuePaid).toFixed(2))
          }
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
          let balance = transaction.operation == "entrada" ? method["balance"] + item["value"] * ((100 - item["percentage"]) / 100) : method["balance"] - item["value"] * ((100 - item["percentage"]) / 100);
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
    return "Pagamento confirmado com sucesso";
  }
}
exports.ConfirmedDealerService = ConfirmedDealerService;