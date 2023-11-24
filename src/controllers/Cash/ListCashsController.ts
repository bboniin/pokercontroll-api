import { Request, Response } from 'express';
import { ListCashsService } from '../../services/Cash/ListCashsService';

class ListCashsController {
    async handle(req: Request, res: Response) {

        let { page, all } = req.query
        let club_id = req.club_id

        const listCashsService = new ListCashsService

        const cash = await listCashsService.execute({
            club_id, page: Number(page) > 0 ? Number(page) : 0, all: all == "true" ? true : false
        })

        return res.json(cash)
    }
}

export { ListCashsController }