import prismaClient from "../../prisma";

interface ChipRequest {
  cash_id: string;
  club_id: string;
}

class ListChipsAuditService {
  async execute({ cash_id }: ChipRequest) {
    const chips = await prismaClient.chipAudit.findMany({
      where: {
        cash_id: cash_id,
      },
      orderBy: {
        create_at: "asc",
      },
    });

    return chips;
  }
}

export { ListChipsAuditService };
