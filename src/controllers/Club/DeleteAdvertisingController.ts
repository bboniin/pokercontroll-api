import { Request, Response } from "express";
import { DeleteAdvertisingService } from "../../services/Club/DeleteAdvertisingService";

class DeleteAdvertisingController {
  async handle(req: Request, res: Response) {
    const { advertising_id } = req.params;

    const club_id = req.club_id;

    const deleteAdvertisingService = new DeleteAdvertisingService();

    const advertising = await deleteAdvertisingService.execute({
      club_id,
      advertising_id,
    });

    return res.json(advertising);
  }
}

export { DeleteAdvertisingController };
