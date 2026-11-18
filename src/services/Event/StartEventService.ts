import prismaClient from "../../prisma";

interface StartEventRequest {
  event_id: string;
  club_id: string;
}

class StartEventService {
  async execute({ event_id, club_id }: StartEventRequest) {
    if (!event_id) {
      throw new Error("ID do evento é obrigatório");
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

    if (event.status === "ativo") {
      throw new Error("Este evento já está ativo");
    }

    if (event.status === "finalizado") {
      throw new Error("Um evento finalizado não pode ser iniciado novamente");
    }

    // Verifica se já existe outro evento ativo no clube
    const currentActive = await prismaClient.event.findFirst({
      where: {
        club_id,
        status: "ativo",
      },
    });

    if (currentActive) {
      throw new Error(
        `Já existe o evento ativo "${currentActive.name}". Finalize-o antes de iniciar este evento.`
      );
    }

    const startedEvent = await prismaClient.event.update({
      where: {
        id: event_id,
      },
      data: {
        status: "ativo",
        created_at: new Date(), // marca o início oficial do período do evento
      },
      include: {
        tournaments: true,
      },
    });

    return startedEvent;
  }
}

export { StartEventService };
