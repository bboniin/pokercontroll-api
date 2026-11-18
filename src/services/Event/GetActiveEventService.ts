import prismaClient from "../../prisma";

interface GetActiveEventRequest {
  club_id: string;
}

class GetActiveEventService {
  async execute({ club_id }: GetActiveEventRequest) {
    if (!club_id) {
      throw new Error("ID do clube é obrigatório");
    }

    const activeEvent = await prismaClient.event.findFirst({
      where: {
        club_id,
        status: "ativo",
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
        },
      },
    });

    return activeEvent;
  }
}

export { GetActiveEventService };
