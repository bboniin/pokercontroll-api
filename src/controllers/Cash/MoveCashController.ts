import { Request, Response } from "express";
import { MoveCashService } from "../../services/Cash/MoveCashService";

class MoveCashController {
  async handle(req: Request, res: Response) {
    const { id, chair, cash_id } = req.body;

    let club_id = req.club_id;

    const moveCashService = new MoveCashService();

    const client = await moveCashService.execute({
      chair,
      id,
      club_id,
      cash_id,
    });

    if (client["photo"]) {
      client["photo_url"] =
        "https://pokercontrol-data.s3.sa-east-1.amazonaws.com/" +
        client["photo"];
    }

    return res.json(client);
  }
}

export { MoveCashController };
