"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CreateTournamentService = void 0;
var _prisma = _interopRequireDefault(require("../../prisma"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class CreateTournamentService {
  async execute({
    name,
    timechip,
    chairs,
    totalAward_guaranteed,
    intervals,
    nivel_max_in,
    nivel_max_timechip,
    percentage_players_award,
    rankings,
    club_id,
    purchases,
    vacancys,
    blinds,
    type,
    target_tournament_id
  }) {
    if (!name || !chairs || !intervals || !nivel_max_in || type !== "classificatorio" && !percentage_players_award || !club_id) {
      throw new Error("Preencha os campos obrigatórios");
    }
    if (!purchases.some(data => data["type"] == "entrie")) {
      throw new Error("Preencha pelo menos uma opção de compra em Entrada");
    }
    if (vacancys) {
      if (vacancys.some(data => !data["name"] || !data["value"])) {
        throw new Error("Preencha todos os campos das vagas");
      }
    }
    if (rankings.length) {
      Promise.all(await rankings.map(async data => {
        const ranking = await _prisma.default.ranking.findFirst({
          where: {
            id: data["id"],
            status: "andamento"
          }
        });
        if (!ranking) {
          throw new Error(`Ranking vinculado não encontrado ou encerrado`);
        }
      }));
    }
    const tournament = await _prisma.default.tournament.create({
      data: {
        name: name,
        timechip: timechip || 0,
        chairs: chairs,
        max_in: nivel_max_in,
        max_timechip: nivel_max_timechip,
        percentage_players_award: percentage_players_award,
        totalAward_guaranteed: totalAward_guaranteed || 0,
        club_id: club_id,
        type: type,
        total_tokens: 0,
        totalAward_accumulated: 0,
        blinds: blinds,
        intervals: intervals,
        classified_tournament_id: target_tournament_id || null
      }
    });
    let vacancysArray = [];
    vacancys.map(item => {
      vacancysArray.push({
        name: item.name,
        description: item.description,
        value: item.value,
        tournament_id: tournament.id
      });
    });
    if (vacancysArray.length) {
      await _prisma.default.vacancy.createMany({
        data: vacancysArray
      });
    }
    Promise.all(await purchases.map(async item => {
      if (item["type"] == "entrie") {
        await _prisma.default.purchase.create({
          data: {
            name: item["name"],
            cashier: item["cashier"],
            value: item["value"] || 0,
            max_limit: item["max_limit"],
            token: item["token"],
            type: item["type"],
            value_staff: item["value_staff"] || 0,
            token_staff: item["token_staff"] || 0,
            multiple: item["multiple"] || false,
            is_staff: item["is_staff"] || false,
            tournament_id: tournament.id
          }
        });
      }
      if (item["type"] == "service") {
        await _prisma.default.purchase.create({
          data: {
            name: item["name"],
            cashier: item["cashier"],
            value: item["value"] || 0,
            max_limit: item["max_limit"],
            token: item["token"],
            type: item["type"],
            tournament_id: tournament.id
          }
        });
      }
      if (item["type"] == "purchase") {
        await _prisma.default.purchase.create({
          data: {
            name: item["name"],
            cashier: item["cashier"],
            value: item["value"] || 0,
            max_limit: item["max_limit"],
            token: item["token"],
            type: item["type"],
            value_staff: item["value_staff"] || 0,
            token_staff: item["token_staff"] || 0,
            multiple: item["multiple"] || false,
            is_staff: item["is_staff"] || false,
            tournament_id: tournament.id
          }
        });
      }
    }));
    Promise.all(await rankings.map(async data => {
      const rankingTournament = await _prisma.default.tournamentRanking.create({
        data: {
          tournament_id: tournament.id,
          ranking_id: data["id"],
          value: data["value"],
          percentage: data["percentage"],
          type: data["type"]
        }
      });
      data["rules"].map(async item => {
        await _prisma.default.tournamentRankingRule.create({
          data: {
            tournament_ranking_id: rankingTournament.id,
            points: item["points"],
            min_position: item["min"],
            max_position: item["max"]
          }
        });
      });
    }));
    return tournament;
  }
}
exports.CreateTournamentService = CreateTournamentService;