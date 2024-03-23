import { Request, Response } from 'express';
import { CreateTransactionClubeService } from '../../services/Transaction/CreateTransactionClubeService';

class CreateTransactionClubeController {
    async handle(req: Request, res: Response) {
        const { value, type, name, date_payment, methods_transaction, observation, operation } = req.body

        let club_id = req.club_id

        const createTransactionClubeService = new CreateTransactionClubeService

        let valueCredit = methods_transaction.filter((item) => item["id"] == "Crédito").length != 0 ? methods_transaction.filter((item) => item["id"] == "Crédito")[0].value : 0
        
        const transaction = await createTransactionClubeService.execute({
            paid: valueCredit ? false : true, value, type, methods_transaction, items_transaction: {
                name: name || "Manual",
                amount: 1,
                value: value
            }, club_id, date_payment, observation, operation
        })

        return res.json(transaction)
    }
}

export { CreateTransactionClubeController }