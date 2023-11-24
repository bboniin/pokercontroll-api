import { Request, Response } from 'express';
import { CreateTransactionClubeService } from '../../services/Transaction/CreateTransactionClubeService';

class CreateTransactionClubeController {
    async handle(req: Request, res: Response) {
        const { paid, value, type, name, date_payment, observation, operation } = req.body

        let club_id = req.club_id

        const createTransactionClubeService = new CreateTransactionClubeService

        const transaction = await createTransactionClubeService.execute({
            paid, value, type, methods_transaction: {
                name: "Manual",
                percentage: 0,
                value: value,
            }, items_transaction: {
                name: name,
                amount: 1,
                value: value
            }, club_id, date_payment, observation, operation
        })

        return res.json(transaction)
    }
}

export { CreateTransactionClubeController }