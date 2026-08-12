"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PaymentReceivesService = void 0;
var _prisma = _interopRequireDefault(require("../../prisma"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class PaymentReceivesService {
  async execute({
    club_id,
    client_id,
    value,
    confirm,
    user_id
  }, tx) {
    const prisma = tx || _prisma.default;
    const valueTotal = value;
    if (!club_id || !client_id || !value) {
      throw new Error("id cliente, clube e valor a ser pago são obrigatórios");
    }
    const client = await prisma.client.findFirst({
      where: {
        id: client_id,
        club_id: club_id
      }
    });
    if (!client) {
      throw new Error("Cliente não encontrada");
    }
    if (parseFloat(client.receive.toFixed(2)) < value) {
      throw new Error("Valor de pagamento com saldo é maior do que o cliente tem a receber");
    }
    const transactions = await prisma.transaction.findMany({
      where: {
        client_id: client_id,
        club_id: club_id,
        paid: false,
        operation: "saida"
      },
      orderBy: {
        create_at: "asc"
      }
    });
    if (transactions.length == 0) {
      throw new Error("Nenhuma transação não encontrada");
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
    await Promise.all(await transactions.map(async (item, index) => {
      if (valueTransaction[index]) {
        let valuePaid = item.value - item.value_paid;
        if (valuePaid <= valueTransaction[index]) {
          await prisma.transaction.update({
            where: {
              id: item.id
            },
            data: {
              paid: true,
              value_paid: item.value
            }
          });
          await prisma.methodsTransaction.create({
            data: {
              name: "Saldo",
              percentage: 0,
              value: valueTransaction[index],
              transaction_id: item.id,
              user_id
            }
          });
        } else {
          await prisma.transaction.update({
            where: {
              id: item.id
            },
            data: {
              value_paid: item.value_paid + valueTransaction[index]
            }
          });
          await prisma.methodsTransaction.create({
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
    }));
    await prisma.client.update({
      where: {
        id: client.id
      },
      data: confirm ? {
        debt: parseFloat((client.debt - valueTotal).toFixed(2)),
        receive: parseFloat((client.receive - valueTotal).toFixed(2))
      } : {
        receive: parseFloat((client.receive - valueTotal).toFixed(2))
      }
    });
    return "Pagamentos realizados com sucesso";
  }
}
exports.PaymentReceivesService = PaymentReceivesService;