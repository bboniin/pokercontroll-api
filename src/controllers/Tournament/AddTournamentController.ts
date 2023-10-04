import { Request, Response } from 'express';
import { AddTournamentService } from '../../services/Tournament/AddTournamentService';

class AddTournamentController {
    async handle(req: Request, res: Response) {
        const { id, chair, tournament_id } = req.body

        let club_id = req.club_id

        const addTournamentService = new AddTournamentService

        const client = await addTournamentService.execute({
            chair, id, tournament_id, club_id
        })

        if (client["photo"]) {
            client["photo_url"] = "https://pokercontroll.s3.sa-east-1.amazonaws.com/" + client["photo"];
        }

        return res.json(client)
    }
}

export { AddTournamentController }