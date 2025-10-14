import { Request, Response } from "express";
import { ClientsExitTournamentService } from "../../services/Tournament/ClientsExitTournamentService";

class ClientsExitTournamentController {
  async handle(req: Request, res: Response) {
    const { tournament_id } = req.params;
    let club_id = req.club_id;

    const clientsExitTournamentService = new ClientsExitTournamentService();

    const clientsExit = await clientsExitTournamentService.execute({
      club_id,
      tournament_id,
    });

    clientsExit.map((item) => {
      if (item["photo"]) {
        item["photo_url"] =
          "https://pokercontrol-data.s3.sa-east-1.amazonaws.com/" +
          item["photo"];
      }
    });

    return res.json(clientsExit);
  }
}

export { ClientsExitTournamentController };
