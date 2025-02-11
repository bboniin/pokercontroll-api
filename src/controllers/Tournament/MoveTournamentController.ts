import { Request, Response } from 'express';
import { MoveTournamentService } from '../../services/Tournament/MoveTournamentService';

class MoveTournamentController {
    async handle(req: Request, res: Response) {
        const { id, chair, tournament_id } = req.body

        const moveTournamentService = new MoveTournamentService

        const client = await moveTournamentService.execute({
            chair, id, tournament_id
        })

        if (client["photo"]) {
            client["photo_url"] = "https://pokercontrol-data.s3.sa-east-1.amazonaws.com/" + client["photo"];
        }

        return res.json(client)
    }
}

export { MoveTournamentController }