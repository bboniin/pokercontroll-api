import { Request, Response } from "express";
import { OpenTournamentService } from "../../services/Tournament/OpenTournamentService";

class OpenTournamentController {
  async handle(req: Request, res: Response) {
    const { tournament_id } = req.params;

    let club_id = req.club_id;

    const openTournamentService = new OpenTournamentService();

    const tournament = await openTournamentService.execute({
      tournament_id,
      club_id,
    });

    return res.json(tournament);
  }
}

export { OpenTournamentController };
