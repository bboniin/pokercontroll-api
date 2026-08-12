import prismaClient from "../../prisma";

interface ChipRequest {
  value: number;
  color: string;
  club_id: string;
}

class CreateChipService {
  async execute({ value, color, club_id }: ChipRequest) {
    if (!value || !color || !club_id) {
      throw new Error("Preencha os campos obrigatórios");
    }

    const chip = await prismaClient.chip.create({
      data: {
        value: value,
        color: color,
        club_id: club_id,
      },
    });

    return chip;
  }
}

export { CreateChipService };
