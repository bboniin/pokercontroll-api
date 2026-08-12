import { Request, Response } from "express";
import { CreateCaixinhaService } from "../../services/Cash/CreateCaixinhaService";

class CreateCaixinhaController {
  async handle(req: Request, res: Response) {
    const { value, observation } = req.body;
    const { id } = req.params;

    let club_id = req.club_id;
    let user_id = req.user_id;

    const createCaixinhaService = new CreateCaixinhaService();

    const caixinha = await createCaixinhaService.execute({
      club_id,
      user_id,
      id,
      value,
      observation,
    });

    return res.json(caixinha);
  }
}

export { CreateCaixinhaController };
