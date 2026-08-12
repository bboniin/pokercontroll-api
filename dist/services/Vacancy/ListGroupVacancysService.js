"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ListGroupVacancysService = void 0;
var _prisma = _interopRequireDefault(require("../../prisma"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class ListGroupVacancysService {
  async execute({
    club_id
  }) {
    const vacancys = await _prisma.default.vacancy.findMany({
      where: {
        tournament: {
          club_id: club_id
        }
      },
      orderBy: {
        create_at: "desc"
      },
      include: {
        tournament: true,
        client: true
      }
    });
    const groupedVacancys = vacancys.reduce((acc, vacancy) => {
      const {
        name
      } = vacancy;
      if (!acc[name]) {
        acc[name] = [];
      }
      acc[name].push(vacancy);
      return acc;
    }, {});
    const groupedArray = Object.entries(groupedVacancys).map(([name, vacancys]) => ({
      name,
      vacancys
    }));
    return groupedArray;
  }
}
exports.ListGroupVacancysService = ListGroupVacancysService;