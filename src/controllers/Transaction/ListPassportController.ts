import { Request, Response } from 'express';
import { ListPassportService } from '../../services/Transaction/ListPassportService';

class ListPassportController {
    async handle(req: Request, res: Response) {

        let { page } = req.query
        let club_id = req.club_id

        const listPassportService = new ListPassportService

        const passport = await listPassportService.execute({
            club_id, page: Number(page) > 0 ? Number(page) : 0
        })

        return res.json(passport)
    }
}

export { ListPassportController }