"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GetClientService = void 0;
var _prisma = _interopRequireDefault(require("../../prisma"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class GetClientService {
  async execute({
    client_id,
    club_id,
    page
  }) {
    const client = await _prisma.default.client.findFirst({
      where: {
        id: client_id,
        club_id: club_id,
        visible: true
      },
      include: {
        transactions: {
          skip: page * 30,
          take: 30,
          orderBy: {
            create_at: "desc"
          },
          include: {
            methods_transaction: true,
            items_transaction: true
          }
        },
        vacancys: true,
        client_tournaments: true
      }
    });
    const transactionsTotal = await _prisma.default.transaction.count({
      where: {
        client_id: client_id,
        club_id: club_id
      }
    });
    if (!client) {
      throw new Error("Cliente não encontrado");
    }
    return {
      client,
      transactionsTotal
    };
  }
}
exports.GetClientService = GetClientService;