"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ListAdvertisingsService = void 0;
var _prisma = _interopRequireDefault(require("../../prisma"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class ListAdvertisingsService {
  async execute({
    club_id
  }) {
    const advertisings = await _prisma.default.advertising.findMany({
      where: {
        club_id: club_id
      },
      orderBy: {
        order: "asc"
      }
    });
    return advertisings;
  }
}
exports.ListAdvertisingsService = ListAdvertisingsService;