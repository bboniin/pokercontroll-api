import { Request, Response } from "express";
import { EditCaixinhaService } from "../../services/Cash/EditCaixinhaService";

class EditCaixinhaController {
  async handle(req: Request, res: Response) {
    const { value, observation } = req.body;
    const { id } = req.params;

    let club_id = req.club_id;
    let user_id = req.user_id;

    const editCaixinhaService = new EditCaixinhaService();

    const caixinha = await editCaixinhaService.execute({
      club_id,
      user_id,
      id,
      value,
      observation,
    });

    return res.json(caixinha);
  }
}

export { EditCaixinhaController };
