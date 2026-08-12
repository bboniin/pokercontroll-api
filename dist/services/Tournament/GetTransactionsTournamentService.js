"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GetTransactionsTournamentService = void 0;
var _prisma = _interopRequireDefault(require("../../prisma"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class GetTransactionsTournamentService {
  async execute({
    id,
    club_id,
    client_id
  }) {
    if (!id || !club_id || !client_id) {
      throw new Error("Envie o id do cliente, torneio e do clube");
    }
    const client = await _prisma.default.client.findUnique({
      where: {
        id: client_id
      }
    });
    const clientName = client ? client.name : "";
    const transactions = await _prisma.default.transaction.findMany({
      where: {
        OR: [{
          client_id: client_id,
          NOT: {
            observation: {
              contains: "Pago para "
            }
          }
        }, ...(clientName ? [{
          observation: {
            contains: `Pago para ${clientName}`
          }
        }] : [])],
        club_id: club_id,
        sector_id: id
      },
      include: {
        items_transaction: true
      }
    });
    return transactions;
  }
}
exports.GetTransactionsTournamentService = GetTransactionsTournamentService;