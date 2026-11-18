import { Request, Response } from "express";
import { DeleteEventService } from "../../services/Event/DeleteEventService";

class DeleteEventController {
  async handle(req: Request, res: Response) {
    const { event_id } = req.params;
    const club_id = req.club_id;

    const deleteEventService = new DeleteEventService();
    const result = await deleteEventService.execute({
      event_id,
      club_id,
    });

    return res.json(result);
  }
}

export { DeleteEventController };
