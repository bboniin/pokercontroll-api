import { Request, Response } from 'express';
import { CreateTransactionService } from '../../services/Transaction/CreateTransactionService';

class BuyCashController {
    async handle(req: Request, res: Response) {
        const { paid, value, sector_id, methods_transaction, client_id, date_payment, observation } = req.body

        let club_id = req.club_id

        const createTransactionService = new CreateTransactionService

        const transaction = await createTransactionService.execute({
            paid, value, type: "clube", methods_transaction, items_transaction: [{
                name: "cash",
                amount: 1,
                value: value
            }], client_id, sector_id, club_id, date_payment, observation, operation: "entrada"
        })

        return res.json(transaction)
    }
}

export { BuyCashController }