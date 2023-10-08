import { Request, Response } from 'express';
import { ListTransactionsService } from '../../services/Transaction/ListTransactionsService';

class ListTransactionsController {
    async handle(req: Request, res: Response) {
        let club_id = req.club_id

        const listTransactionsService = new ListTransactionsService

        const transactions = await listTransactionsService.execute({
            club_id
        })

        return res.json(transactions)
    }
}

export { ListTransactionsController }