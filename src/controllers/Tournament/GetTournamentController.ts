import { Request, Response } from 'express';
import { GetTournamentService } from '../../services/Tournament/GetTournamentService';

class GetTournamentController {
    async handle(req: Request, res: Response) {

        const { tournament_id } = req.params

        let club_id = req.club_id

        const getTournamentService = new GetTournamentService

        const tournament = await getTournamentService.execute({
            id: tournament_id, club_id
        })

        return res.json(tournament)
    }
}

export { GetTournamentController }