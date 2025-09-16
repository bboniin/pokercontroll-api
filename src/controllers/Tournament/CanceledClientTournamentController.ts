import { Request, Response } from "express";
import { CanceledClientTournamentService } from "../../services/Tournament/CanceledClientTournamentService";

class CanceledClientTournamentController {
  async handle(req: Request, res: Response) {
    const { client_id } = req.params;
    const { tournament_id, transactions } = req.body;

    let club_id = req.club_id;
    let user_id = req.user_id;

    const canceledClientTournamentService =
      new CanceledClientTournamentService();

    const tournament = await canceledClientTournamentService.execute({
      client_id,
      tournament_id,
      transactions,
      club_id,
      user_id,
    });

    return res.json(tournament);
  }
}

export { CanceledClientTournamentController };
