import prismaClient from "../../prisma";
import S3Storage from "../../utils/S3Storage";

interface AdvertisingRequest {
  file: string;
  club_id: string;
}

class CreateAdvertisingService {
  async execute({ file, club_id }: AdvertisingRequest) {
    if (!club_id || !file) {
      throw new Error("Arquivo e clube são obrigatórios");
    }

    const club = await prismaClient.club.findUnique({
      where: {
        id: club_id,
      },
      include: {
        advertisings: true,
      },
    });

    if (!club) {
      throw new Error("Clube não encontrado");
    }

    const s3Storage = new S3Storage();

    const upload = await s3Storage.saveFile(file);

    const advertising = await prismaClient.advertising.create({
      data: {
        order: club.advertisings.length,
        club_id: club_id,
        file: upload,
        repetitions: 1,
      },
    });

    return advertising;
  }
}

export { CreateAdvertisingService };
