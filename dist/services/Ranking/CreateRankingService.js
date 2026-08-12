"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CreateRankingService = void 0;
var _prisma = _interopRequireDefault(require("../../prisma"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class CreateRankingService {
  async execute({
    club_id,
    name,
    goal_value,
    description
  }) {
    if (!name || !description || !goal_value || !club_id) {
      throw new Error("Nome, descrição e meta são obrigatórios");
    }
    const ranking = await _prisma.default.ranking.create({
      data: {
        name: name,
        description: description,
        club_id: club_id,
        goal_value: goal_value,
        status: "criado"
      }
    });
    return ranking;
  }
}
exports.CreateRankingService = CreateRankingService;