import { Request, Response } from 'express';
import { PausedTournamentService } from '../../services/Tournament/PausedTournamentService';

class PausedTournamentController {
    async handle(req: Request, res: Response) {
        const { tournament_id } = req.params

        let club_id = req.club_id

        const pausedTournamentService = new PausedTournamentService

        const tournament = await pausedTournamentService.execute({
            club_id, tournament_id
        })

        return res.json(tournament)
    }
}

export { PausedTournamentController }