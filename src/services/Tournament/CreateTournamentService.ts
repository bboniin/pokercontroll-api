import prismaClient from "../../prisma";

interface TournamentRequest {
  name: string;
  timechip: number;
  chairs: number;
  totalAward_guaranteed: number;
  intervals: string;
  club_id: string;
  max_rebuy: number;
  rake: number;
  nivel_max_in: number;
  nivel_max_timechip: number;
  percentage_players_award: number;
  vacancy_value: number;
  vacancy_total: number;
  is_rebuy: boolean;
  show_max: boolean;
  rankings: Array<[]>;
  purchases: Array<[]>;
}

class CreateTournamentService {
  async execute({
    name,
    timechip,
    chairs,
    totalAward_guaranteed,
    intervals,
    max_rebuy,
    rake,
    nivel_max_in,
    nivel_max_timechip,
    percentage_players_award,
    show_max,
    is_rebuy,
    rankings,
    club_id,
    purchases,
    vacancy_total,
    vacancy_value,
  }: TournamentRequest) {
    if (
      !name ||
      !timechip ||
      !chairs ||
      !totalAward_guaranteed ||
      !intervals ||
      !rake ||
      !nivel_max_in ||
      !percentage_players_award ||
      !club_id
    ) {
      throw new Error("Preencha os campos obrigatórios");
    }

    if (
      !purchases.some((data) => data["type"] == "service") ||
      !purchases.some((data) => data["type"] == "purchase") ||
      !purchases.some((data) => data["type"] == "entrie")
    ) {
      throw new Error(
        "Preencha pelo menos uma opção de compra em Entrada, Compras e Serviços"
      );
    }

    if (vacancy_total) {
      if (!vacancy_value) {
        throw new Error("Preencha o valor das vagas");
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
        timechip: timechip,
        max_rebuy: max_rebuy || 0,
        rake: rake,
        chairs: chairs,
        is_rebuy: is_rebuy,
        max_in: nivel_max_in,
        max_timechip: nivel_max_timechip,
        show_max: show_max,
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

    const vacancies = Array.from({ length: vacancy_total }).map((_, index) => ({
      value: vacancy_value,
      tournament_id: tournament.id,
    }));

    if (vacancies.length) {
      await prismaClient.vacancy.createMany({
        data: vacancies,
      });
    }

    console.log(purchases);
    Promise.all(
      await purchases.map(async (item) => {
        if (item["type"] == "entrie") {
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
        if (item["type"] == "service") {
          console.log(item);
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
