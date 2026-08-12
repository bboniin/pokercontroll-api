"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CreateBankService = void 0;
var _prisma = _interopRequireDefault(require("../../prisma"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class CreateBankService {
  async execute({
    name,
    balance,
    club_id
  }) {
    if (!name || !club_id) {
      throw new Error("Preencha os campos obrigatórios");
    }
    const getBank = await _prisma.default.bank.findFirst({
      where: {
        name: name,
        club_id: club_id
      }
    });
    if (getBank) {
      throw new Error("Banco já cadastrado com esse nome");
    }
    const bank = await _prisma.default.bank.create({
      data: {
        name: name,
        balance: balance || 0,
        club_id: club_id
      }
    });
    return bank;
  }
}
exports.CreateBankService = CreateBankService;