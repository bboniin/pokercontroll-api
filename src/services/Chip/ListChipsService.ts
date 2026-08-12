import prismaClient from "../../prisma";

interface ChipRequest {
  club_id: string;
}

class ListChipsService {
  async execute({ club_id }: ChipRequest) {
    const chips = await prismaClient.chip.findMany({
      where: {
        club_id: club_id,
      },
      orderBy: {
        create_at: "asc",
      },
    });

    return chips;
  }
}

export { ListChipsService };
