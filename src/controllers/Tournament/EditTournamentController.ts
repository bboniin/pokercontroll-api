import { Request, Response } from 'express';
import { EditTournamentService } from '../../services/Tournament/EditTournamentService';

class EditTournamentController {
    async handle(req: Request, res: Response) {
        const { tournament_id } = req.params
        const { name, value, amount } = req.body

        let photo = ""

        if (req.file) {
            photo = req.file.filename
        }

        let club_id = req.club_id

        const editTournamentService = new EditTournamentService

        const tournament = await editTournamentService.execute({
            name, value: value ? parseFloat(value) : 0, amount: amount ? parseFloat(amount) : 0, photo, club_id, tournament_id
        })

        return res.json(tournament)
    }
}

export { EditTournamentController }