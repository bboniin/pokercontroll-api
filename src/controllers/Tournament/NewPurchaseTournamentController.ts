import { Request, Response } from "express";
import { NewPurchaseTournamentService } from "../../services/Tournament/NewPurchaseTournamentService";

class NewPurchaseTournamentController {
  async handle(req: Request, res: Response) {
    const { tournament_id } = req.params;
    const {
      name,
      cashier,
      value,
      max_limit,
      token,
      value_staff,
      type,
      token_staff,
      multiple,
      is_staff,
    } = req.body;

    let club_id = req.club_id;

    const newPurchaseTournamentService = new NewPurchaseTournamentService();

    const tournament = await newPurchaseTournamentService.execute({
      tournament_id,
      name,
      cashier,
      value,
      max_limit,
      token,
      value_staff,
      type,
      token_staff,
      multiple,
      club_id,
      is_staff,
    });

    return res.json(tournament);
  }
}

export { NewPurchaseTournamentController };
