import { Request, Response } from 'express';
import { ListTournamentsService } from '../../services/Tournament/ListTournamentsService';

class ListTournamentsController {
    async handle(req: Request, res: Response) {

        let { page } = req.query
        let club_id = req.club_id

        const listTournamentsService = new ListTournamentsService

        const tournaments = await listTournamentsService.execute({
            club_id, page: Number(page) > 0 ? Number(page) : 0
        })

        return res.json(tournaments)
    }
}

export { ListTournamentsController }