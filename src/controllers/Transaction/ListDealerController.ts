import { Request, Response } from 'express';
import { ListDealerService } from '../../services/Transaction/ListDealerService';

class ListDealerController {
    async handle(req: Request, res: Response) {

        let { page } = req.query
        let club_id = req.club_id

        const listDealerService = new ListDealerService

        const dealer = await listDealerService.execute({
            club_id, page: Number(page) > 0 ? Number(page) : 0
        })

        return res.json(dealer)
    }
}

export { ListDealerController }