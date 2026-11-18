import prismaClient from "../../prisma";

interface ListEventsRequest {
  club_id: string;
}

class ListEventsService {
  async execute({ club_id }: ListEventsRequest) {
    if (!club_id) {
      throw new Error("ID do clube é obrigatório");
    }

    const events = await prismaClient.event.findMany({
      where: {
        club_id,
      },
      orderBy: {
        created_at: "desc",
      },
      include: {
        tournaments: {
          select: {
            id: true,
            name: true,
            status: true,
            type: true,
            create_at: true,
          },
          orderBy: {
            create_at: "desc",
          },
        },
      },
    });

    // Para cada evento, também busca torneios que ocorreram no período do evento caso não estejam explicitamente associados pelo event_id
    const clubTournaments = await prismaClient.tournament.findMany({
      where: {
        club_id,
      },
      select: {
        id: true,
        name: true,
        status: true,
        type: true,
        create_at: true,
        event_id: true,
      },
      orderBy: {
        create_at: "desc",
      },
    });

    const enrichedEvents = events.map((event) => {
      const start = event.created_at ? new Date(event.created_at).getTime() : 0;
      const end = event.closed_at ? new Date(event.closed_at).getTime() : Date.now();

      const periodTournaments = clubTournaments.filter((t) => {
        if (t.event_id && t.event_id === event.id) return true;
        const tDate = t.create_at ? new Date(t.create_at).getTime() : 0;
        return tDate >= start && tDate <= end;
      });

      // Remove duplicados se houver
      const uniqueMap = new Map();
      [...(event.tournaments || []), ...periodTournaments].forEach((t) => {
        uniqueMap.set(t.id, t);
      });

      return {
        ...event,
        tournaments: Array.from(uniqueMap.values()),
      };
    });

    return enrichedEvents;
  }
}

export { ListEventsService };
