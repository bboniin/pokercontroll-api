import { Request, Response } from "express";
import { StartEventService } from "../../services/Event/StartEventService";

class StartEventController {
  async handle(req: Request, res: Response) {
    const club_id = req.club_id;
    const { event_id } = req.params;

    const startEventService = new StartEventService();
    const event = await startEventService.execute({
      event_id,
      club_id,
    });

    return res.json(event);
  }
}

export { StartEventController };
