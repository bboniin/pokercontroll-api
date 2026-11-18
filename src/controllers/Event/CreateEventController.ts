import { Request, Response } from "express";
import { CreateEventService } from "../../services/Event/CreateEventService";

class CreateEventController {
  async handle(req: Request, res: Response) {
    const { name, status } = req.body;
    const club_id = req.club_id;

    const createEventService = new CreateEventService();
    const event = await createEventService.execute({
      name,
      club_id,
      status,
    });

    return res.json(event);
  }
}

export { CreateEventController };
