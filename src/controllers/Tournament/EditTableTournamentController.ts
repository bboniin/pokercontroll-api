import { Request, Response } from "express";
import { EditTableTournamentService } from "../../services/Tournament/EditTableTournamentService";

class EditTableTournamentController {
  async handle(req: Request, res: Response) {
    const { tournament_id } = req.params;
    const { type } = req.body;
    let club_id = req.club_id;

    const editTableTournamentService = new EditTableTournamentService();

    const tournament = await editTableTournamentService.execute({
      tournament_id,
      type,
      club_id,
    });

    return res.json(tournament);
  }
}

export { EditTableTournamentController };
