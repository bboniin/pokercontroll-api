import { Request, Response } from "express";
import { ListEventsService } from "../../services/Event/ListEventsService";

class ListEventsController {
  async handle(req: Request, res: Response) {
    const club_id = req.club_id;

    const listEventsService = new ListEventsService();
    const events = await listEventsService.execute({ club_id });

    return res.json(events);
  }
}

export { ListEventsController };
