"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DeleteBankService = void 0;
var _prisma = _interopRequireDefault(require("../../prisma"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class DeleteBankService {
  async execute({
    bank_id,
    club_id
  }) {
    const getBank = await _prisma.default.bank.findFirst({
      where: {
        id: bank_id,
        club_id: club_id
      }
    });
    if (!getBank) {
      throw new Error("Banco não encontrado");
    }
    const bank = await _prisma.default.bank.delete({
      where: {
        id: bank_id
      }
    });
    return bank;
  }
}
exports.DeleteBankService = DeleteBankService;