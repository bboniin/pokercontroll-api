"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ListPayablesService = void 0;
var _prisma = _interopRequireDefault(require("../../prisma"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class ListPayablesService {
  async execute({
    club_id,
    page,
    all
  }) {
    let filter = {};
    if (!all) {
      filter = {
        skip: page * 30,
        take: 30
      };
    }
    const payablesTotal = await _prisma.default.payable.count({
      where: {
        club_id: club_id
      }
    });
    const payables = await _prisma.default.payable.findMany({
      ...filter,
      where: {
        club_id: club_id
      },
      orderBy: {
        create_at: "asc"
      }
    });
    return all ? payables : {
      payables,
      payablesTotal
    };
  }
}
exports.ListPayablesService = ListPayablesService;