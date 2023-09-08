import { Request, Response } from 'express';
import { ConfirmedTransactionService } from '../../services/Transaction/ConfirmedTransactionService';

class ConfirmedTransactionController {
    async handle(req: Request, res: Response) {
        const { id } = req.params
        const { method } = req.body

        let club_id = req.club_id

        const confirmedTransactionService = new ConfirmedTransactionService

        const transaction = await confirmedTransactionService.execute({
            id, club_id, method
        })

        return res.json(transaction)
    }
}

export { ConfirmedTransactionController }