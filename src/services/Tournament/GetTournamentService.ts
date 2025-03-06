import prismaClient from "../../prisma";

interface TournamentRequest {
  id: string;
  club_id: string;
}

class GetTournamentService {
  async execute({ id, club_id }: TournamentRequest) {
    if (!id || !club_id) {
      throw new Error("Envie o id do produto e do clube");
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
            purchases: true,
          },
        },
        purchases: true,
        clients_purchases: true,
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

    let niveis = tournament.blinds.split("-");
    let newNiveis = [];
    Promise.all(
      await niveis.map(async (item) => {
        let [small, big] = item.split("/");
        if (small.endsWith("000")) {
          small = small.slice(0, -3) + "K";
        }
        if (big.endsWith("000")) {
          big = big.slice(0, -3) + "K";
        }
        newNiveis.push(small + "/" + big);
      })
    );

    tournament["niveis"] = newNiveis;

    return tournament;
  }
}

export { GetTournamentService };
