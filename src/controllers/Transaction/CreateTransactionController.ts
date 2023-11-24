import { Request, Response } from 'express';
import { CreateTransactionService } from '../../services/Transaction/CreateTransactionService';

class CreateTransactionController {
    async handle(req: Request, res: Response) {
        const { paid, value, sector_id, type, methods_transaction, items_transaction, client_id, date_payment, observation, operation } = req.body

        let club_id = req.club_id

        const createTransactionService = new CreateTransactionService

        const transaction = await createTransactionService.execute({
            paid: value == 0 ? true : paid, value, type, sector_id, methods_transaction: methods_transaction || [], items_transaction, client_id, club_id, date_payment, observation, operation
        })

        return res.json(transaction)
    }
}

export { CreateTransactionController }