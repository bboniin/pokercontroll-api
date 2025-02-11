import { Request, Response } from 'express';
import { ClearCashService } from '../../services/Cash/ClearCashService';

class ClearCashController {
    async handle(req: Request, res: Response) {

        let club_id = req.club_id

        const clearCashService = new ClearCashService

        const clients = await clearCashService.execute({
            club_id
        })

        return res.json(clients)
    }
}

export { ClearCashController }