import { Request, Response } from "express";
import { EditPurchaseTournamentService } from "../../services/Tournament/EditPurchaseTournamentService";

class EditPurchaseTournamentController {
  async handle(req: Request, res: Response) {
    const { purchase_id } = req.params;
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

    const editPurchaseTournamentService = new EditPurchaseTournamentService();

    const purchase = await editPurchaseTournamentService.execute({
      purchase_id,
      name,
      cashier,
      value: value ? parseFloat(value) : 0,
      max_limit: max_limit ? parseInt(max_limit) : 0,
      token: token ? parseInt(token) : 0,
      value_staff: value_staff ? parseFloat(value_staff) : 0,
      type,
      token_staff: token_staff ? parseInt(token_staff) : 0,
      multiple,
      club_id,
      is_staff,
    });

    return res.json(purchase);
  }
}

export { EditPurchaseTournamentController };
