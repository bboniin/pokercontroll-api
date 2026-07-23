import prismaClient from "../../prisma";

interface ClubRequest {
  club_id: string;
}

class GetClubService {
  async execute({ club_id }: ClubRequest) {
    const club = await prismaClient.club.findUnique({
      where: {
        id: club_id,
      },
    });

    if (!club) {
      throw new Error("Clube não encontrado");
    }

    return club;
  }
}

export { GetClubService };
