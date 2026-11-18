import prismaClient from "../../prisma";

interface FinishEventRequest {
  event_id: string;
  club_id: string;
}

class FinishEventService {
  async execute({ event_id, club_id }: FinishEventRequest) {
    if (!event_id || !club_id) {
      throw new Error("ID do evento e do clube são obrigatórios");
    }

    const event = await prismaClient.event.findFirst({
      where: {
        id: event_id,
        club_id,
      },
    });

    if (!event) {
      throw new Error("Evento não encontrado");
    }

    if (event.status === "finalizado") {
      throw new Error("Este evento já está finalizado");
    }

    const start = event.created_at ? new Date(event.created_at) : new Date(0);
    const now = new Date();

    // Busca todos os torneios pertencentes ao evento
    const tournaments = await prismaClient.tournament.findMany({
      where: {
        club_id,
        OR: [
          { event_id: event.id },
          {
            create_at: {
              gte: start,
              lte: now,
            },
          },
        ],
      },
      select: {
        id: true,
        name: true,
        status: true,
      },
    });

    // Torneios que ainda não foram encerrados
    const unclosedTournaments = tournaments.filter(
      (t) => t.status !== "encerrado"
    );

    if (unclosedTournaments.length > 0) {
      const names = unclosedTournaments.map((t) => t.name).join(", ");
      throw new Error(
        `Não é possível finalizar o evento. Existem torneios ainda não encerrados no período: ${names}`
      );
    }

    const updatedEvent = await prismaClient.event.update({
      where: {
        id: event.id,
      },
      data: {
        status: "finalizado",
        closed_at: now,
      },
    });

    return updatedEvent;
  }
}

export { FinishEventService };
