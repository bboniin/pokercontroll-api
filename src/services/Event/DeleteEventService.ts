import prismaClient from "../../prisma";

interface DeleteEventRequest {
  event_id: string;
  club_id: string;
}

class DeleteEventService {
  async execute({ event_id, club_id }: DeleteEventRequest) {
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

    await prismaClient.event.delete({
      where: {
        id: event_id,
      },
    });

    return { message: "Evento deletado com sucesso" };
  }
}

export { DeleteEventService };
