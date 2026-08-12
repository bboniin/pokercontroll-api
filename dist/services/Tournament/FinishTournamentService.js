"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FinishTournamentService = void 0;
var _prisma = _interopRequireDefault(require("../../prisma"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class FinishTournamentService {
  async execute({
    tournament_id,
    club_id,
    classifieds
  }) {
    const tournament = await _prisma.default.tournament.findFirst({
      where: {
        club_id: club_id,
        id: tournament_id
      },
      include: {
        rankings: {
          include: {
            tournament_rules: true
          }
        }
      }
    });
    if (!tournament) {
      throw new Error("Torneio não encontrado");
    }
    if (tournament.type != "classificatorio") {
      const clientTournament = await _prisma.default.clientTournament.findFirst({
        where: {
          exit: false,
          tournament_id: tournament_id
        }
      });
      if (clientTournament) {
        throw new Error("Elimine todos os jogadores para finalizar o torneio");
      }
    } else {
      const tournamentClassified = await _prisma.default.tournament.findUnique({
        where: {
          id: tournament.classified_tournament_id
        }
      });
      if (!tournamentClassified) {
        throw new Error("Torneio final não encontrado");
      }
      const hasInvalidTokens = classifieds.some(item => typeof item.tokens !== "number" || isNaN(item.tokens) || !isFinite(item.tokens));
      if (hasInvalidTokens) {
        throw new Error("Todos os classificados devem ter a quantidade de fichas preenchidas.");
      }
      const sortedClassifieds = [...classifieds].sort((a, b) => a.tokens - b.tokens);
      await _prisma.default.$transaction(async tx => {
        let totalTokensClassified = 0;
        for (const item of sortedClassifieds) {
          const clientTournament = await tx.clientTournament.findFirst({
            where: {
              client_id: item.id,
              tournament_id: tournament_id,
              exit: false
            }
          });
          if (clientTournament) {
            const clientTournamentClassified = await tx.clientTournament.findFirst({
              where: {
                client_id: item.id,
                tournament_id: tournamentClassified.id,
                exit: false
              }
            });
            await tx.clientTournament.update({
              where: {
                id: clientTournament.id
              },
              data: {
                exit: true,
                tokens_classified: item.tokens,
                chair_tournament: "",
                date_out: new Date()
              }
            });
            if (clientTournamentClassified) {
              await tx.clientTournament.update({
                where: {
                  id: clientTournamentClassified.id
                },
                data: {
                  tokens_classified: item.tokens > clientTournamentClassified.tokens_classified ? item.tokens : clientTournamentClassified.tokens_classified
                }
              });
              totalTokensClassified += item.tokens > clientTournamentClassified.tokens_classified ? item.tokens - clientTournamentClassified.tokens_classified : 0;
            } else {
              await tx.clientTournament.create({
                data: {
                  client_id: item.id,
                  tournament_id: tournamentClassified.id,
                  tokens_classified: item.tokens,
                  exit: false,
                  is_classified: true
                }
              });
              totalTokensClassified += item.tokens;
            }
          }
        }
        await tx.tournament.update({
          where: {
            id: tournamentClassified.id
          },
          data: {
            total_tokens: tournamentClassified.total_tokens + totalTokensClassified
          }
        });
      });
    }
    const tournamentC = await _prisma.default.tournament.update({
      where: {
        id: tournament_id
      },
      data: {
        status: "encerrado"
      },
      include: {
        clients: {
          orderBy: {
            date_out: "desc"
          },
          include: {
            client: true,
            purchases: true
          }
        },
        purchases: true,
        clients_purchases: true,
        vacancys: {
          include: {
            client: true
          }
        },
        rankings: true
      }
    });
    const clientTournaments = await _prisma.default.clientTournament.findMany({
      where: {
        tournament_id: tournament_id
      },
      orderBy: {
        date_out: "desc"
      }
    });
    let rules = [];
    tournament.rankings.map(data => {
      data.tournament_rules.map(item => {
        rules.push({
          min: item.min_position,
          max: item.max_position,
          points: item.points,
          ranking_id: data.ranking_id
        });
      });
    });
    Promise.all(await clientTournaments.map((client, idx) => {
      const rulesClient = rules.filter(r => idx + 1 >= r.min && idx + 1 <= r.max);
      rulesClient.map(async data => {
        await _prisma.default.clientPoints.create({
          data: {
            client_id: client.client_id,
            points: data.points,
            position: idx + 1,
            ranking_id: data.ranking_id
          }
        });
      });
    }));
    return tournamentC;
  }
}
exports.FinishTournamentService = FinishTournamentService;