"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ListBanksService = void 0;
var _prisma = _interopRequireDefault(require("../../prisma"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class ListBanksService {
  async execute({
    club_id
  }) {
    const banks = await _prisma.default.bank.findMany({
      where: {
        club_id: club_id
      },
      orderBy: {
        create_at: "asc"
      }
    });
    return banks;
  }
}
exports.ListBanksService = ListBanksService;