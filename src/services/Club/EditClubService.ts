import prismaClient from "../../prisma";
import S3Storage from "../../utils/S3Storage";

interface ClubRequest {
  club_id: string;
  font_color: string;
  background_color: string;
  primary_color: string;
  background_image: string;
  border_tournament: boolean;
  logo_tournament: boolean;
  photo: string;
  delete_background: string;
  delete_photo: string;
}

class EditClubService {
  async execute({
    club_id,
    primary_color,
    font_color,
    background_color,
    photo,
    background_image,
    logo_tournament,
    border_tournament,
    delete_photo,
    delete_background,
  }: ClubRequest) {
    const s3Storage = new S3Storage();

    if (delete_background) {
      await s3Storage.deleteFile(delete_background);

      background_image = "";
    }

    if (delete_photo) {
      await s3Storage.deleteFile(delete_photo);

      background_image = "";
    }

    if (background_image) {
      const upload = await s3Storage.saveFile(background_image);

      background_image = upload;
    }

    if (photo) {
      const upload = await s3Storage.saveFile(photo);

      photo = upload;
    }

    const club = await prismaClient.club.update({
      where: {
        id: club_id,
      },
      data: {
        primary_color: primary_color,
        font_color: font_color,
        background_color: background_color,
        background_image: background_image,
        photo: photo,
        logo_tournament: logo_tournament,
        border_tournament: border_tournament,
      },
    });

    return club;
  }
}

export { EditClubService };
