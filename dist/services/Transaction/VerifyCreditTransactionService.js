"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VerifyCreditTransactionService = void 0;
var _prisma = _interopRequireDefault(require("../../prisma"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class VerifyCreditTransactionService {
  async execute({
    value,
    club_id,
    client_id,
    club
  }, tx) {
    const prisma = tx || _prisma.default;
    const client = await prisma.client.findFirst({
      where: {
        id: client_id,
        club_id: club_id
      }
    });
    if (club) {
      await prisma.client.update({
        where: {
          id: client_id
        },
        data: {
          receive: parseFloat((client.receive + value).toFixed(2))
        }
      });
    } else {
      if (client.debt + value > client.credit) {
        throw new Error("Crédito insuficiente para essa transação");
      } else {
        await prisma.client.update({
          where: {
            id: client_id
          },
          data: {
            debt: parseFloat((client.debt + value).toFixed(2))
          }
        });
      }
    }
  }
}
exports.VerifyCreditTransactionService = VerifyCreditTransactionService;