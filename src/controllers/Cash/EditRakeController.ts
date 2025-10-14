import { Request, Response } from "express";
import { EditRakeService } from "../../services/Cash/EditRakeService";

class EditRakeController {
  async handle(req: Request, res: Response) {
    const { value } = req.body;
    const { id } = req.params;

    let club_id = req.club_id;
    let user_id = req.user_id;

    const editRakeService = new EditRakeService();

    const rake = await editRakeService.execute({
      club_id,
      user_id,
      id,
      value,
    });

    return res.json(rake);
  }
}

export { EditRakeController };
