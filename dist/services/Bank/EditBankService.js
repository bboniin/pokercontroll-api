"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EditBankService = void 0;
var _prisma = _interopRequireDefault(require("../../prisma"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class EditBankService {
  async execute({
    name,
    balance,
    club_id,
    bank_id
  }) {
    if (!name || !bank_id) {
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
    const bank = await _prisma.default.bank.update({
      where: {
        id: bank_id
      },
      data: {
        name: name,
        balance: balance || 0,
        club_id: club_id
      }
    });
    return bank;
  }
}
exports.EditBankService = EditBankService;