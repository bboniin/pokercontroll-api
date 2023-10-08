import { Request, Response } from 'express';
import { ConfirmedJackpotService } from '../../services/Transaction/ConfirmedJackpotService';

class ConfirmedJackpotController {
    async handle(req: Request, res: Response) {
        const { id } = req.params
        const { method } = req.body

        let club_id = req.club_id

        const confirmedJackpotService = new ConfirmedJackpotService

        const jackpot = await confirmedJackpotService.execute({
            id, club_id, method
        })

        return res.json(jackpot)
    }
}

export { ConfirmedJackpotController }