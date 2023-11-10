import { Request, Response } from 'express';
import { ConfirmedJackpotService } from '../../services/Transaction/ConfirmedJackpotService';

class ConfirmedJackpotController {
    async handle(req: Request, res: Response) {
        const { id } = req.params
        const { methods_transaction } = req.body

        let club_id = req.club_id

        const confirmedJackpotService = new ConfirmedJackpotService

        const jackpot = await confirmedJackpotService.execute({
            id, club_id, methods_transaction
        })

        return res.json(jackpot)
    }
}

export { ConfirmedJackpotController }