import { Request, Response } from "express";
import { ReturnClientTournamentService } from "../../services/Tournament/ReturnClientTournamentService";

class ReturnClientTournamentController {
  async handle(req: Request, res: Response) {
    const { client_id, tournament_id } = req.body;

    let club_id = req.club_id;
    let user_id = req.user_id;

    const returnClientTournamentService = new ReturnClientTournamentService();

    const tournament = await returnClientTournamentService.execute({
      client_id,
      tournament_id,
      club_id,
    });

    return res.json(tournament);
  }
}

export { ReturnClientTournamentController };
