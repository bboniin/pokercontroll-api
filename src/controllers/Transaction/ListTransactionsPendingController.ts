import { Request, Response } from 'express';
import { ListTransactionsPendingService } from '../../services/Transaction/ListTransactionsPendingService';

class ListTransactionsPendingController {
    async handle(req: Request, res: Response) {

        const { client_id } = req.params;

        let club_id = req.club_id

        const listTransactionsPendingService = new ListTransactionsPendingService

        const transactionsPending = await listTransactionsPendingService.execute({
            club_id, client_id
        })

        return res.json(transactionsPending)
    }
}

export { ListTransactionsPendingController }