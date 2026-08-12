import prismaClient from "../../prisma";

interface ChipRequest {
  value: number;
  color: string;
  club_id: string;
  chip_id: string;
}

class EditChipService {
  async execute({ value, club_id, color, chip_id }: ChipRequest) {
    if (!chip_id || !value || !color || !club_id) {
      throw new Error("Preencha os campos obrigatórios");
    }

    const chip = await prismaClient.chip.findFirst({
      where: {
        id: chip_id,
        club_id: club_id,
      },
    });

    if (!chip) {
      throw new Error("Ficha não encontrada");
    }

    const chipEdit = await prismaClient.chip.update({
      where: {
        id: chip_id,
      },
      data: {
        value: value,
        color: color,
      },
    });

    return chipEdit;
  }
}

export { EditChipService };
