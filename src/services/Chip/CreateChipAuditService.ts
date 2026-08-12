import prismaClient from "../../prisma";

interface ChipRequest {
  briefcase_value: number;
  chips_value: number;
  cash_id: string;
  club_id: string;
}

class CreateChipAuditService {
  async execute({
    chips_value,
    briefcase_value,
    cash_id,
    club_id,
  }: ChipRequest) {
    if (!cash_id || !chips_value || !briefcase_value || !club_id) {
      throw new Error("Preencha os campos obrigatórios");
    }

    const chipAudit = await prismaClient.chipAudit.create({
      data: {
        briefcase_value: briefcase_value,
        chips_value: chips_value,
        cash_id: cash_id,
      },
    });

    return chipAudit;
  }
}

export { CreateChipAuditService };
