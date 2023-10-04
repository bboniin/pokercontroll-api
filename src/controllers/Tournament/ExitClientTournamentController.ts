import { Request, Response } from 'express';
import { ExitClientTournamentService } from '../../services/Tournament/ExitClientTournamentService';

class ExitClientTournamentController {
    async handle(req: Request, res: Response) {
        const { client_id } = req.params
        const { tournament_id } = req.body

        let club_id = req.club_id

        const exitClientTournamentService = new ExitClientTournamentService

        const tournament = await exitClientTournamentService.execute({
            client_id, club_id, tournament_id
        })

        return res.json(tournament)
    }
}

export { ExitClientTournamentController }