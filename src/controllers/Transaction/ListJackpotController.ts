import { Request, Response } from 'express';
import { ListJackpotService } from '../../services/Transaction/ListJackpotService';

class ListJackpotController {
    async handle(req: Request, res: Response) {

        let { page } = req.query
        let club_id = req.club_id

        const listJackpotService = new ListJackpotService

        const jackpot = await listJackpotService.execute({
            club_id, page: Number(page) > 0 ? Number(page) : 0
        })

        return res.json(jackpot)
    }
}

export { ListJackpotController }