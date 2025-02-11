import { Request, Response } from 'express';
import { CreateTransactionService } from '../../services/Transaction/CreateTransactionService';
import { VerifyCreditTransactionService } from '../../services/Transaction/VerifyCreditTransactionService';
import { PaymentReceivesService } from '../../services/Transaction/PaymentReceivesService';

class BuyCashController {
    async handle(req: Request, res: Response) {
        const { value, sector_id, methods_transaction, client_id, date_payment, observation } = req.body

        let club_id = req.club_id

        let valueCredit = methods_transaction.filter((item) => item["id"] == "Crédito" ).length != 0 ? methods_transaction.filter((item) => item["id"] == "Crédito" )[0].value : 0

        if (valueCredit) {
            const verifyCreditTransactionService = new VerifyCreditTransactionService

            await verifyCreditTransactionService.execute({
                client_id, club_id, value: valueCredit
            })
        }

        let valueReceive = methods_transaction.filter((item) => item["id"] == "Saldo" ).length != 0 ? methods_transaction.filter((item) => item["id"] == "Saldo")[0].value : 0
        
        const paymentDebtsService = new PaymentReceivesService

        if (valueReceive) {
            await paymentDebtsService.execute({
                value: valueReceive, client_id, club_id
            })
        }

        const createTransactionService = new CreateTransactionService

        const transaction = await createTransactionService.execute({
            paid: valueReceive == value ? true : valueCredit ? false : true, value, type: "clube", methods_transaction, items_transaction: [{
                name: "cash",
                amount: 1,
                value: value
            }], client_id, sector_id, club_id, date_payment, observation, operation: "entrada", valueReceive, valueDebit: 0
        })

        return res.json(transaction)
    }
}

export { BuyCashController }