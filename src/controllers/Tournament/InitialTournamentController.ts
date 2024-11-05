import { Request, Response } from 'express';
import { InitialTournamentService } from '../../services/Tournament/InitialTournamentService';

class InitialTournamentController {
    async handle(req: Request, res: Response) {
        const { tournament_id } = req.params

        let club_id = req.club_id

        const initialTournamentService = new InitialTournamentService

        const tournament = await initialTournamentService.execute({
            tournament_id, club_id
        })

        return res.json(tournament)
    }
}

export { InitialTournamentController }