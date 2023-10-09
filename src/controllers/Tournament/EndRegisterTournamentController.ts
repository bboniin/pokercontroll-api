import { Request, Response } from 'express';
import { EndRegisterTournamentService } from '../../services/Tournament/EndRegisterTournamentService';

class EndRegisterTournamentController {
    async handle(req: Request, res: Response) {
        const { tournament_id } = req.params
        const { award, staff } = req.body

        let club_id = req.club_id

        const endRegisterTournamentService = new EndRegisterTournamentService

        const tournament = await endRegisterTournamentService.execute({
            tournament_id, club_id, award, staff
        })

        return res.json(tournament)
    }
}

export { EndRegisterTournamentController }