import { Request, Response } from 'express';
import { CreateTransactionClubeService } from '../../services/Transaction/CreateTransactionClubeService';
import { PaymentReceivesService } from '../../services/Transaction/PaymentReceivesService';
import { PaymentDebtsService } from '../../services/Transaction/PaymentDebtsService';
import { CreateTransactionService } from '../../services/Transaction/CreateTransactionService';

class CreateTransactionClubeController {
    async handle(req: Request, res: Response) {
        const { value, type, name, client_id, date_payment, methods_transaction, observation, operation } = req.body

        let club_id = req.club_id

        let valueCredit = methods_transaction.filter((item) => item["id"] == "Crédito").length != 0 ? methods_transaction.filter((item) => item["id"] == "Crédito")[0].value : 0
        
        if (client_id) {
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

            const createTransactionService = new CreateTransactionService

            const transaction = await createTransactionService.execute({
                paid: valueCredit ? false : true, value, type: "clube", methods_transaction, items_transaction: [{
                    name: name || "Manual",
                    amount: 1,
                    value: value
                }], club_id, date_payment, sector_id: "", observation, operation, client_id, valueReceive, valueDebit
            })
            return res.json(transaction)
        } else {
            const createTransactionClubeService = new CreateTransactionClubeService

            const transaction = await createTransactionClubeService.execute({
                paid: valueCredit ? false : true, value, type, methods_transaction, items_transaction: {
                    name: name || "Manual",
                    amount: 1,
                    value: value
                }, club_id, date_payment, observation, operation, valueReceive: 0, valueDebit: 0
            })
            return res.json(transaction)
        }

        

    }
}

export { CreateTransactionClubeController }