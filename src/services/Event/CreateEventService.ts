import prismaClient from "../../prisma";

interface EventRequest {
  name: string;
  club_id: string;
  status?: string;
}

class CreateEventService {
  async execute({ name, club_id, status }: EventRequest) {
    if (!name || !name.trim()) {
      throw new Error("O nome do evento é obrigatório");
    }

    if (!club_id) {
      throw new Error("ID do clube é obrigatório");
    }

    const activeEvent = await prismaClient.event.findFirst({
      where: {
        club_id,
        status: "ativo",
      },
    });

    let eventStatus = status || (activeEvent ? "criado" : "ativo");

    // Se o usuário solicitou explicitamente status "ativo", mas já existe um ativo, ele fica como "criado"
    if (eventStatus === "ativo" && activeEvent) {
      eventStatus = "criado";
    }

    const event = await prismaClient.event.create({
      data: {
        name: name.trim(),
        club_id,
        status: eventStatus,
        created_at: new Date(),
      },
    });

    return event;
  }
}

export { CreateEventService };
