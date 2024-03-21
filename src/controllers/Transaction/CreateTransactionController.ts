import { Request, Response } from 'express';
import { CreateTransactionService } from '../../services/Transaction/CreateTransactionService';
import { VerifyCreditTransactionService } from '../../services/Transaction/VerifyCreditTransactionService';

class CreateTransactionController {
    async handle(req: Request, res: Response) {
        const { value, sector_id, type, methods_transaction, items_transaction, client_id, date_payment, observation, operation } = req.body

        let club_id = req.club_id

        const createTransactionService = new CreateTransactionService

        let valueCredit = methods_transaction.filter((item) => item["id"] == "Crédito" ).length != 0 ? methods_transaction.filter((item) => item["id"] == "Crédito")[0].value : 0

        if (valueCredit) {
            const verifyCreditTransactionService = new VerifyCreditTransactionService

            await verifyCreditTransactionService.execute({
                client_id, club_id, value: valueCredit
            })
        }

        const transaction = await createTransactionService.execute({
            paid: valueCredit ? false : true, value, type, sector_id, methods_transaction: methods_transaction, items_transaction, client_id, club_id, date_payment, observation, operation
        })

        return res.json(transaction)
    }
}

export { CreateTransactionController }