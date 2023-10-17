import { Request, Response } from 'express';
import { ConfirmedDealerService } from '../../services/Transaction/ConfirmedDealerService';

class ConfirmedDealerController {
    async handle(req: Request, res: Response) {
        const { id } = req.params
        const { method } = req.body

        let club_id = req.club_id

        const confirmedDealerService = new ConfirmedDealerService

        const dealer = await confirmedDealerService.execute({
            id, club_id, method
        })

        return res.json(dealer)
    }
}

export { ConfirmedDealerController }