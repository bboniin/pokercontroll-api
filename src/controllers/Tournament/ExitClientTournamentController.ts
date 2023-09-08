import { Request, Response } from 'express';
import { ExitClientTournamentService } from '../../services/Tournament/ExitClientTournamentService';

class ExitClientTournamentController {
    async handle(req: Request, res: Response) {
        const { client_id } = req.params

        let club_id = req.club_id

        const exitClientTournamentService = new ExitClientTournamentService

        const client = await exitClientTournamentService.execute({
            client_id, club_id
        })

        if (client["photo"]) {
            client["photo_url"] = "https://pokercontroll.s3.sa-east-1.amazonaws.com/" + client["photo"];
        }

        return res.json(client)
    }
}

export { ExitClientTournamentController }