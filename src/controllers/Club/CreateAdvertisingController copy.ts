import { Request, Response } from "express";
import { CreateAdvertisingService } from "../../services/Club/CreateAdvertisingService";

class CreateAdvertisingController {
  async handle(req: Request, res: Response) {
    let file = "";

    if (req.file) {
      file = req.file.filename;
    }

    const club_id = req.club_id;

    const createAdvertisingService = new CreateAdvertisingService();

    const advertising = await createAdvertisingService.execute({
      club_id,
      file,
    });

    return res.json(advertising);
  }
}

export { CreateAdvertisingController };
