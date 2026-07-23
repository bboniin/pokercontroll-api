import { Request, Response } from "express";
import { GetClubService } from "../../services/Club/GetClubService";

class GetClubController {
  async handle(req: Request, res: Response) {
    const club_id = req.club_id;

    const getClubService = new GetClubService();

    const club = await getClubService.execute({
      club_id,
    });

    if (club["photo"]) {
      club["photo_url"] =
        "https://pokercontrol-data.s3.sa-east-1.amazonaws.com/" + club["photo"];
    }

    if (club["background_image"]) {
      club["background_image_url"] =
        "https://pokercontrol-data.s3.sa-east-1.amazonaws.com/" +
        club["background_image"];
    }

    return res.json(club);
  }
}

export { GetClubController };
