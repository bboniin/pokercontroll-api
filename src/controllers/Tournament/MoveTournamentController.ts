import { Request, Response } from 'express';
import { MoveTournamentService } from '../../services/Tournament/MoveTournamentService';

class MoveTournamentController {
    async handle(req: Request, res: Response) {
        const { id, chair } = req.body

        let club_id = req.club_id

        const moveTournamentService = new MoveTournamentService

        const client = await moveTournamentService.execute({
            chair, id, club_id
        })

        if (client["photo"]) {
            client["photo_url"] = "https://pokercontroll.s3.sa-east-1.amazonaws.com/" + client["photo"];
        }

        return res.json(client)
    }
}

export { MoveTournamentController }