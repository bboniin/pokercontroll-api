import { Request, Response } from 'express';
import { FinishTournamentService } from '../../services/Tournament/FinishTournamentService';

class FinishTournamentController {
    async handle(req: Request, res: Response) {
        const { tournament_id } = req.params

        let club_id = req.club_id

        const finishTournamentService = new FinishTournamentService

        const tournament = await finishTournamentService.execute({
            tournament_id, club_id
        })

        return res.json(tournament)
    }
}

export { FinishTournamentController }