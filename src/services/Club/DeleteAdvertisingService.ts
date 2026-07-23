import prismaClient from "../../prisma";
import S3Storage from "../../utils/S3Storage";

interface AdvertisingRequest {
  advertising_id: string;
  club_id: string;
}

class DeleteAdvertisingService {
  async execute({ advertising_id, club_id }: AdvertisingRequest) {
    const advertisingGet = await prismaClient.advertising.findFirst({
      where: {
        id: advertising_id,
        club_id,
      },
    });

    if (!advertisingGet) {
      throw new Error("Anuncio não encontrado");
    }

    const advertising = await prismaClient.advertising.delete({
      where: {
        id: advertising_id,
      },
    });

    if (advertising.file) {
      const s3Storage = new S3Storage();

      await s3Storage.deleteFile(advertising.file);
    }

    return advertising;
  }
}

export { DeleteAdvertisingService };
