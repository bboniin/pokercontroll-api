import { Request, Response } from "express";
import { DeletePurchaseTournamentService } from "../../services/Tournament/DeletePurchaseTournamentService";

class DeletePurchaseTournamentController {
  async handle(req: Request, res: Response) {
    const { purchase_id } = req.params;
    let club_id = req.club_id;

    const deletePurchaseTournamentService = new DeletePurchaseTournamentService();

    const result = await deletePurchaseTournamentService.execute({
      purchase_id,
      club_id,
    });

    return res.json(result);
  }
}

export { DeletePurchaseTournamentController };
