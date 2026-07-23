import { Request, Response } from "express";
import { ListAdvertisingsService } from "../../services/Club/ListAdvertisingsService";

class ListAdvertisingsController {
  async handle(req: Request, res: Response) {
    let club_id = req.club_id;

    const listAdvertisingsService = new ListAdvertisingsService();

    const advertisings = await listAdvertisingsService.execute({
      club_id,
    });

    advertisings.map((item) => {
      if (item["file"]) {
        item["file_url"] =
          "https://pokercontrol-data.s3.sa-east-1.amazonaws.com/" +
          item["file"];
      }
    });

    return res.json(advertisings);
  }
}

export { ListAdvertisingsController };
