import prismaClient from "../../prisma";

interface AdvertisingRequest {
  advertisings: {
    id: string;
    repetitions: number;
  }[];
  club_id: string;
}

class OrderAdvertisingsService {
  async execute({ advertisings, club_id }: AdvertisingRequest) {
    if (!club_id || !advertisings) {
      throw new Error("Arquivo e clube são obrigatórios");
    }

    const club = await prismaClient.club.findUnique({
      where: {
        id: club_id,
      },
    });

    if (!club) {
      throw new Error("Clube não encontrado");
    }

    const updateOperations = advertisings.map((advertising, index) => {
      return prismaClient.advertising.update({
        where: { id: advertising.id },
        data: {
          order: index,
          repetitions: advertising.repetitions,
        },
      });
    });

    const orderAdvertisings = await prismaClient.$transaction(updateOperations);

    return orderAdvertisings;
  }
}

export { OrderAdvertisingsService };
