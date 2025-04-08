import { Request, Response } from "express";
import { GetTransactionsTournamentService } from "../../services/Tournament/GetTransactionsTournamentService";

class GetTransactionsTournamentController {
  async handle(req: Request, res: Response) {
    const { tournament_id } = req.params;
    const { client_id } = req.query;

    let club_id = req.club_id;

    const getTransactionsTournamentService =
      new GetTransactionsTournamentService();

    const tournament = await getTransactionsTournamentService.execute({
      id: tournament_id,
      club_id,
      client_id: String(client_id),
    });

    return res.json(tournament);
  }
}

export { GetTransactionsTournamentController };
