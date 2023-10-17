import { Request, Response } from 'express';
import { EndCashService } from '../../services/Cash/EndCashService';

class EndCashController {
    async handle(req: Request, res: Response) {

        const { cash_id } = req.params

        let club_id = req.club_id

        const endCashService = new EndCashService

        const cash = await endCashService.execute({
            club_id, cash_id
        })

        return res.json(cash)
    }
}

export { EndCashController }