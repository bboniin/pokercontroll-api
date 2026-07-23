import prismaClient from "../../prisma";

interface AdvertisingRequest {
  club_id: string;
}

class ListAdvertisingsService {
  async execute({ club_id }: AdvertisingRequest) {
    const advertisings = await prismaClient.advertising.findMany({
      where: {
        club_id: club_id,
      },
      orderBy: {
        order: "asc",
      },
    });

    return advertisings;
  }
}

export { ListAdvertisingsService };
