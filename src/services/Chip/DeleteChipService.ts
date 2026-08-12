import prismaClient from "../../prisma";

interface ChipRequest {
  chip_id: string;
  club_id: string;
}

class DeleteChipService {
  async execute({ chip_id, club_id }: ChipRequest) {
    const chip = await prismaClient.chip.delete({
      where: {
        id: chip_id,
      },
    });
    return chip;
  }
}

export { DeleteChipService };
