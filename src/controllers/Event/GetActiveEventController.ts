import { Request, Response } from "express";
import { GetActiveEventService } from "../../services/Event/GetActiveEventService";

class GetActiveEventController {
  async handle(req: Request, res: Response) {
    const club_id = req.club_id;

    const getActiveEventService = new GetActiveEventService();
    const event = await getActiveEventService.execute({ club_id });

    return res.json(event);
  }
}

export { GetActiveEventController };
