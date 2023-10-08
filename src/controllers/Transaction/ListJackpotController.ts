import { Request, Response } from 'express';
import { ListJackpotService } from '../../services/Transaction/ListJackpotService';

class ListJackpotController {
    async handle(req: Request, res: Response) {

        let club_id = req.club_id

        const listJackpotService = new ListJackpotService

        const jackpot = await listJackpotService.execute({
            club_id
        })

        return res.json(jackpot)
    }
}

export { ListJackpotController }