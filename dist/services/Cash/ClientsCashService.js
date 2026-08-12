"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ClientsCashService = void 0;
var _prisma = _interopRequireDefault(require("../../prisma"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class ClientsCashService {
  async execute({
    cash_id
  }) {
    const clients = await _prisma.default.clientCash.findMany({
      where: {
        cash_id: cash_id
      },
      orderBy: {
        exit: "asc"
      },
      include: {
        client: {
          include: {
            transactions: {
              where: {
                sector_id: cash_id
              },
              orderBy: {
                create_at: "asc"
              },
              include: {
                methods_transaction: true
              }
            }
          }
        }
      }
    });
    return clients;
  }
}
exports.ClientsCashService = ClientsCashService;