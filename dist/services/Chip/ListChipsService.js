"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ListChipsService = void 0;
var _prisma = _interopRequireDefault(require("../../prisma"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class ListChipsService {
  async execute({
    club_id
  }) {
    const chips = await _prisma.default.chip.findMany({
      where: {
        club_id: club_id
      },
      orderBy: {
        create_at: "asc"
      }
    });
    return chips;
  }
}
exports.ListChipsService = ListChipsService;