"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ListVacancysService = void 0;
var _prisma = _interopRequireDefault(require("../../prisma"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class ListVacancysService {
  async execute({
    club_id,
    page,
    name
  }) {
    const vacancysTotal = await _prisma.default.vacancy.count({
      where: {
        tournament: {
          club_id: club_id
        },
        name: name
      }
    });
    const vacancys = await _prisma.default.vacancy.findMany({
      where: {
        tournament: {
          club_id: club_id
        },
        name: name
      },
      orderBy: {
        create_at: "desc"
      },
      include: {
        tournament: true,
        client: true
      },
      skip: page * 30,
      take: 30
    });
    return {
      vacancys,
      vacancysTotal
    };
  }
}
exports.ListVacancysService = ListVacancysService;