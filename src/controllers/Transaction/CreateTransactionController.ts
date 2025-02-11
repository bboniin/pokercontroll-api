import { Request, Response } from 'express';
import { CreateTransactionService } from '../../services/Transaction/CreateTransactionService';
import { VerifyCreditTransactionService } from '../../services/Transaction/VerifyCreditTransactionService';
import { PaymentReceivesService } from '../../services/Transaction/PaymentReceivesService';
import { PaymentDebtsService } from '../../services/Transaction/PaymentDebtsService';

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

        let valueReceive = methods_transaction.filter((item) => item["id"] == "Saldo" ).length != 0 ? methods_transaction.filter((item) => item["id"] == "Saldo")[0].value : 0
        
        const paymentReceivesService = new PaymentReceivesService

        if (valueReceive) {
            await paymentReceivesService.execute({
                value: valueReceive, client_id: client_id, club_id
            })
        }

        let valueDebit = methods_transaction.filter((item) => item["id"] == "Pag Dívida" ).length != 0 ? methods_transaction.filter((item) => item["id"] == "Pag Dívida")[0].value : 0
       
        const paymentDebtsService = new PaymentDebtsService

        if (valueDebit) {
            await paymentDebtsService.execute({
                value: valueDebit, client_id, club_id
            })
        }

        const transaction = await createTransactionService.execute({
            paid: valueCredit ? false : true, value, type, sector_id, methods_transaction: methods_transaction,
            items_transaction, client_id, club_id, date_payment, observation, operation, valueReceive, valueDebit
        })

        return res.json(transaction)
    }
}

export { CreateTransactionController }