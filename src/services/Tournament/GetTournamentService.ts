import prismaClient from "../../prisma";

interface TournamentRequest {
  id: string;
  club_id: string;
  blind: boolean;
}

class GetTournamentService {
  async execute({ id, club_id, blind }: TournamentRequest) {
    if (!id || !club_id) {
      throw new Error("Envie o id do torneio e do clube");
    }

    const tournament = await prismaClient.tournament.findFirst({
      where: {
        id: id,
        club_id: club_id,
      },
      include: {
        clients: {
          orderBy: {
            date_out: "desc",
          },
          include: {
            client: true,
            purchases: {
              include: {
                buyer: true,
              },
            },
          },
        },
        purchases: true,
        clients_purchases: blind
          ? {
              where: {
                NOT: {
                  client: {
                    chair_tournament: "",
                    exit: false,
                  },
                },
              },
              include: {
                buyer: true,
              },
            }
          : {
              include: {
                buyer: true,
              },
            },
        vacancys: {
          include: {
            client: true,
          },
        },
        rankings: true,
      },
    });

    if (!tournament) {
      throw new Error("Torneio não encontrado");
    }

    const transactions = await prismaClient.transaction.findMany({
      where: {
        sector_id: tournament.id,
      },
      include: {
        client: true,
        items_transaction: true,
      },
      orderBy: {
        create_at: "desc",
      },
    });

    tournament["transactions"] = transactions;

    let niveis = tournament.blinds.split("-");
    let newNiveis = [];
    Promise.all(
      await niveis.map(async (item) => {
        let [small, big] = item.split("/");
        if (small?.endsWith("000")) {
          small = small.slice(0, -3) + "K";
        }
        if (big?.endsWith("000")) {
          big = big.slice(0, -3) + "K";
        }
        newNiveis.push(small + "/" + big);
      }),
    );

    tournament["niveis"] = newNiveis;

    if (tournament.classified_tournament_id) {
      const targetTournament = await prismaClient.tournament.findUnique({
        where: {
          id: tournament.classified_tournament_id,
        },
      });
      tournament["target_tournament"] = targetTournament;
    }

    return tournament;
  }
}

export { GetTournamentService };
