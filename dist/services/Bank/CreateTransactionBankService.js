"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CreateTransactionBankService = void 0;
var _prisma = _interopRequireDefault(require("../../prisma"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class CreateTransactionBankService {
  async execute({
    name,
    bank_id,
    observation,
    operation,
    value,
    club_id
  }) {
    if (!name || !club_id || !bank_id || !operation || !value) {
      throw new Error("Preencha os campos obrigatórios");
    }
    const getBank = await _prisma.default.bank.findFirst({
      where: {
        id: bank_id,
        club_id: club_id
      }
    });
    if (!getBank) {
      throw new Error("Banco não encontrado");
    }
    const transaction = await _prisma.default.transactionBank.create({
      data: {
        name: name,
        value: value,
        operation: operation == "entrada" ? "entrada" : "saida",
        bank_id: bank_id,
        observation: observation
      }
    });
    if (operation == "entrada") {
      await _prisma.default.bank.update({
        where: {
          id: bank_id
        },
        data: {
          balance: getBank.balance + value
        }
      });
    } else {
      await _prisma.default.bank.update({
        where: {
          id: bank_id
        },
        data: {
          balance: getBank.balance - value
        }
      });
    }
    return transaction;
  }
}
exports.CreateTransactionBankService = CreateTransactionBankService;