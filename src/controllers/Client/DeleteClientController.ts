import { Request, Response } from "express";
import { DeleteClientService } from "../../services/Client/DeleteClientService";

class DeleteClientController {
  async handle(req: Request, res: Response) {
    const { client_id } = req.params;

    let club_id = req.club_id;
    let user_id = req.user_id;

    const deleteClientService = new DeleteClientService();

    const user = await deleteClientService.execute({
      club_id,
      client_id,
      user_id,
    });

    return res.json(user);
  }
}

export { DeleteClientController };
