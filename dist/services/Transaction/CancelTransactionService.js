"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CancelTransactionService = void 0;
var _prisma = _interopRequireDefault(require("../../prisma"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class CancelTransactionService {
  async execute({
    club_id,
    user_id,
    client_id,
    value
  }) {
    let valueTotal = value;
    if (!club_id || !client_id || !value) {
      throw new Error("id cliente, clube e valor a ser pago são obrigatórios");
    }
    const client = await _prisma.default.client.findFirst({
      where: {
        id: client_id,
        club_id: club_id
      }
    });
    if (!client) {
      throw new Error("Cliente não encontrada");
    }
    if (client.debt < value) {
      throw new Error("Valor de pagamento da divida é maior que a divida do cliente");
    }
    const transactions = await _prisma.default.transaction.findMany({
      where: {
        client_id: client_id,
        paid: false,
        operation: "entrada"
      },
      orderBy: {
        create_at: "asc"
      }
    });
    if (transactions.length == 0) {
      throw new Error("Nenhuma transação encontrada");
    }
    let valueTransaction = [];
    await transactions.map(item => {
      if (value) {
        let valuePaid = item.value - item.value_paid;
        if (valuePaid <= value) {
          valueTransaction.push(valuePaid);
          value -= valuePaid;
        } else {
          valueTransaction.push(value);
          value = 0;
        }
      } else {
        valueTransaction.push(0);
      }
    });
    await transactions.map(async (item, index) => {
      if (valueTransaction[index]) {
        let valuePaid = item.value - item.value_paid;
        if (valuePaid <= valueTransaction[index]) {
          await _prisma.default.transaction.update({
            where: {
              id: item.id
            },
            data: {
              paid: true,
              value_paid: item.value
            }
          });
          await _prisma.default.methodsTransaction.create({
            data: {
              name: "Saldo",
              percentage: 0,
              value: valueTransaction[index],
              transaction_id: item.id,
              user_id
            }
          });
        } else {
          await _prisma.default.transaction.update({
            where: {
              id: item.id
            },
            data: {
              value_paid: item.value_paid + valueTransaction[index]
            }
          });
          await _prisma.default.methodsTransaction.create({
            data: {
              name: "Saldo",
              percentage: 0,
              value: valueTransaction[index],
              transaction_id: item.id,
              user_id
            }
          });
        }
      }
    });
    await _prisma.default.client.update({
      where: {
        id: client_id
      },
      data: {
        debt: parseFloat((client.debt - valueTotal).toFixed(2))
      }
    });
    return "Pagamentos realizados com sucesso";
  }
}
exports.CancelTransactionService = CancelTransactionService;