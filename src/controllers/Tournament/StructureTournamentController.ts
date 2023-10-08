import { Request, Response } from 'express';
import { StructureTournamentService } from '../../services/Tournament/StructureTournamentService';

class StructureTournamentController {
    async handle(req: Request, res: Response) {
        const { tournament_id } = req.params
        const { blinds, intervals} = req.body

        let club_id = req.club_id

        const structureTournamentService = new StructureTournamentService

        const tournament = await structureTournamentService.execute({
            blinds, intervals, club_id, tournament_id
        })

        return res.json(tournament)
    }
}

export { StructureTournamentController }