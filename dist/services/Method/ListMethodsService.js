"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ListMethodsService = void 0;
var _prisma = _interopRequireDefault(require("../../prisma"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class ListMethodsService {
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
    const methodsTotal = await _prisma.default.method.count({
      where: {
        club_id: club_id
      }
    });
    const methods = await _prisma.default.method.findMany({
      ...filter,
      where: {
        club_id: club_id
      },
      orderBy: {
        create_at: "asc"
      }
    });
    return all ? methods : {
      methods,
      methodsTotal
    };
  }
}
exports.ListMethodsService = ListMethodsService;