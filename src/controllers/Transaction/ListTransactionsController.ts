import { Request, Response } from 'express';
import { ListTransactionsService } from '../../services/Transaction/ListTransactionsService';

class ListTransactionsController {
    async handle(req: Request, res: Response) {

        let { filter, page } = req.body
        let club_id = req.club_id

        const listTransactionsService = new ListTransactionsService

        const transactions = await listTransactionsService.execute({
            club_id, page: Number(page) > 0 ? Number(page) : 0, filter
        })

        return res.json(transactions)
    }
}

export { ListTransactionsController }