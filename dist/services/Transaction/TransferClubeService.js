"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TransferClubeService = void 0;
var _prisma = _interopRequireDefault(require("../../prisma"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const typesTransaction = {
  clube: true,
  jackpot: true,
  passport: true,
  dealer: true
};
class TransferClubeService {
  async execute({
    type,
    value,
    club_id,
    typeOut,
    observation,
    methods_transaction,
    user_id
  }) {
    const club = await _prisma.default.club.findUnique({
      where: {
        id: club_id
      }
    });
    if (!type || !typeOut) {
      throw new Error("Caixas são obrigátorios obrigatório");
    }
    if (!!typesTransaction[type] != !!typesTransaction[typeOut]) {
      if (methods_transaction.length) {
        if (value != methods_transaction.map(method => method["value"]).reduce((total, value) => total + value)) {
          throw new Error("Valor restante tem que ser zerado");
        }
      } else {
        throw new Error("Selecione o método de pagamento");
      }
    }
    let updateBalance = {};
    let bank = {};
    let bankOut = {};
    if (!typesTransaction[type]) {
      bank = await _prisma.default.bank.findUnique({
        where: {
          id: type
        }
      });
      if (!bank) {
        throw new Error("Caixa para retirar é inválido");
      }
      type = bank["name"];
    }
    if (!typesTransaction[typeOut]) {
      bankOut = await _prisma.default.bank.findUnique({
        where: {
          id: typeOut
        }
      });
      if (!bankOut) {
        throw new Error("Caixa para receber é inválido");
      }
      typeOut = bankOut["name"];
    }
    if (bank["id"]) {
      await _prisma.default.bank.update({
        where: {
          id: bank["id"]
        },
        data: {
          balance: bank["balance"] - value
        }
      });
      await _prisma.default.transactionBank.create({
        data: {
          name: `Transferencia enviada para ${typeOut}`,
          value: value,
          operation: "saida",
          bank_id: bank["id"],
          observation: observation
        }
      });
    } else {
      switch (type) {
        case "clube":
          updateBalance["balance"] = parseFloat((club.balance - value).toFixed(2));
          break;
        case "passport":
          updateBalance["passport"] = parseFloat((club.passport - value).toFixed(2));
          break;
        case "dealer":
          updateBalance["dealer"] = parseFloat((club.dealer - value).toFixed(2));
          break;
        case "jackpot":
          updateBalance["jackpot"] = parseFloat((club.jackpot - value).toFixed(2));
          break;
      }
      const transaction = await _prisma.default.transaction.create({
        data: {
          type: type,
          value: value,
          club_id: club_id,
          operation: "saida",
          date_payment: new Date(),
          observation: observation,
          paid: true,
          user_id: user_id,
          value_paid: value,
          items_transaction: {
            create: [{
              name: `Transferencia enviada para ${typeOut}`,
              value: value,
              amount: 1
            }]
          }
        }
      });
      if (!!typesTransaction[type] != !!typesTransaction[typeOut] && typesTransaction[type]) {
        methods_transaction.map(async item => {
          const method = await _prisma.default.method.findFirst({
            where: {
              id: item["id"]
            }
          });
          let balance = method["balance"] - item["value"];
          await _prisma.default.method.update({
            where: {
              id: item["id"]
            },
            data: {
              balance: balance
            }
          });
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
        });
      }
    }
    if (bankOut["id"]) {
      await _prisma.default.bank.update({
        where: {
          id: bankOut["id"]
        },
        data: {
          balance: bankOut["balance"] + value
        }
      });
      await _prisma.default.transactionBank.create({
        data: {
          name: `Transferencia recebida de ${type}`,
          value: value,
          operation: "entrada",
          bank_id: bankOut["id"],
          observation: observation
        }
      });
    } else {
      switch (typeOut) {
        case "clube":
          updateBalance["balance"] = parseFloat((club.balance + value).toFixed(2));
          break;
        case "passport":
          updateBalance["passport"] = parseFloat((club.passport + value).toFixed(2));
          break;
        case "dealer":
          updateBalance["dealer"] = parseFloat((club.dealer + value).toFixed(2));
          break;
        case "jackpot":
          updateBalance["jackpot"] = parseFloat((club.jackpot + value).toFixed(2));
          break;
      }
      const transaction = await _prisma.default.transaction.create({
        data: {
          type: typeOut,
          value: value,
          club_id: club_id,
          operation: "entrada",
          date_payment: new Date(),
          observation: observation,
          paid: true,
          user_id: user_id,
          value_paid: value,
          items_transaction: {
            create: [{
              name: `Transferencia recebida de ${type}`,
              value: value,
              amount: 1
            }]
          }
        }
      });
      if (!!typesTransaction[type] != !!typesTransaction[typeOut] && typesTransaction[typeOut]) {
        methods_transaction.map(async item => {
          const method = await _prisma.default.method.findFirst({
            where: {
              id: item["id"]
            }
          });
          let balance = method["balance"] + item["value"];
          await _prisma.default.method.update({
            where: {
              id: item["id"]
            },
            data: {
              balance: balance
            }
          });
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
        });
      }
    }
    await _prisma.default.club.update({
      where: {
        id: club_id
      },
      data: updateBalance
    });
    return "Transferencia realizada com sucesso";
  }
}
exports.TransferClubeService = TransferClubeService;