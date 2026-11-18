import { Request, Response } from "express";
import { FinishEventService } from "../../services/Event/FinishEventService";

class FinishEventController {
  async handle(req: Request, res: Response) {
    const { event_id } = req.params;
    const club_id = req.club_id;

    const finishEventService = new FinishEventService();
    const event = await finishEventService.execute({
      event_id,
      club_id,
    });

    return res.json(event);
  }
}

export { FinishEventController };
