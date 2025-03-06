import prismaClient from "../../prisma";

interface TournamentRequest {
  name: string;
  timechip: number;
  chairs: number;
  totalAward_guaranteed: number;
  intervals: string;
  club_id: string;
  nivel_max_in: number;
  nivel_max_timechip: number;
  percentage_players_award: number;
  rankings: Array<[]>;
  purchases: Array<[]>;
  vacancys: Array<{
    name: string;
    description: string;
    value: number;
    tournament_id: string;
    id: string;
  }>;
}

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
  }: TournamentRequest) {
    if (
      !name ||
      !chairs ||
      !totalAward_guaranteed ||
      !intervals ||
      !nivel_max_in ||
      !percentage_players_award ||
      !club_id
    ) {
      throw new Error("Preencha os campos obrigatórios");
    }

    if (!purchases.some((data) => data["type"] == "entrie")) {
      throw new Error("Preencha pelo menos uma opção de compra em Entrada");
    }

    if (vacancys) {
      if (vacancys.some((data) => !data["name"] || !data["value"])) {
        throw new Error("Preencha todos os campos das vagas");
      }
    }

    if (rankings.length) {
      Promise.all(
        await rankings.map(async (data) => {
          const ranking = await prismaClient.ranking.findFirst({
            where: {
              id: data["id"],
              status: "andamento",
            },
          });

          if (!ranking) {
            throw new Error(`Ranking vinculado não encontrado ou encerrado`);
          }
        })
      );
    }

    const tournament = await prismaClient.tournament.create({
      data: {
        name: name,
        timechip: timechip || 0,
        chairs: chairs,
        max_in: nivel_max_in,
        max_timechip: nivel_max_timechip,
        percentage_players_award: percentage_players_award,
        totalAward_guaranteed: totalAward_guaranteed,
        club_id: club_id,
        total_tokens: 0,
        totalAward_accumulated: 0,
        blinds:
          "100/100-100/200-100/300-200/400-300/600-400/800-500/1000-600/1200-800/1600-1200/2400-1500/3000-2000/4000-2500/5000-3000/6000-4000/8000-5000/10000-6000/12000-7000/14000-8000/16000-10000/20000-12000/25000-15000/30000-20000/4000-25000/50000-30000/60000-40000/80000-50000/100000-60000/120000-80000/160000-100000/200000-120000/240000-150000/30000-200000/400000-250000/500000-300000/600000",
        intervals: intervals,
      },
    });

    let vacancysArray = [];
    vacancys.map((item) => {
      vacancysArray.push({
        name: item.name,
        description: item.description,
        value: item.value,
        tournament_id: tournament.id,
      });
    });

    if (vacancysArray.length) {
      await prismaClient.vacancy.createMany({
        data: vacancysArray,
      });
    }

    Promise.all(
      await purchases.map(async (item) => {
        console.log(item);
        if (item["type"] == "entrie") {
          await prismaClient.purchase.create({
            data: {
              name: item["name"],
              cashier: item["cashier"],
              value: item["value"],
              max_limit: item["max_limit"],
              token: item["token"],
              type: item["type"],
              value_staff: item["value_staff"] || 0,
              token_staff: item["token_staff"] || 0,
              is_staff: item["is_staff"] || false,
              tournament_id: tournament.id,
            },
          });
        }
        if (item["type"] == "service") {
          await prismaClient.purchase.create({
            data: {
              name: item["name"],
              cashier: item["cashier"],
              value: item["value"],
              max_limit: item["max_limit"],
              token: item["token"],
              type: item["type"],
              tournament_id: tournament.id,
            },
          });
        }
        if (item["type"] == "purchase") {
          await prismaClient.purchase.create({
            data: {
              name: item["name"],
              cashier: item["cashier"],
              value: item["value"],
              max_limit: item["max_limit"],
              token: item["token"],
              type: item["type"],
              value_staff: item["value_staff"] || 0,
              token_staff: item["token_staff"] || 0,
              is_staff: item["is_staff"] || false,
              tournament_id: tournament.id,
            },
          });
        }
      })
    );

    Promise.all(
      await rankings.map(async (data) => {
        const rankingTournament = await prismaClient.tournamentRanking.create({
          data: {
            tournament_id: tournament.id,
            ranking_id: data["id"],
            value: data["value"],
          },
        });

        data["rules"].map(async (item) => {
          await prismaClient.tournamentRankingRule.create({
            data: {
              tournament_ranking_id: rankingTournament.id,
              points: item["points"],
              min_position: item["min"],
              max_position: item["max"],
            },
          });
        });
      })
    );

    return tournament;
  }
}

export { CreateTournamentService };
