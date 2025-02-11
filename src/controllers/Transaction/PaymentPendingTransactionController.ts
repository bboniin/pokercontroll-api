import { Request, Response } from 'express';
import { PaymentReceivesService } from '../../services/Transaction/PaymentReceivesService';
import { PaymentPendingService } from '../../services/Transaction/PaymentPendingService';
import { ListTransactionsPendingService } from '../../services/Transaction/ListTransactionsPendingService';

class PaymentPendingTransactionController {
    async handle(req: Request, res: Response) {
        const { client_id } = req.params
        const { methods_transaction, date_payment, observation } = req.body

        let club_id = req.club_id

        let valueCredit = methods_transaction.filter((item) => item["id"] == "Crédito").length != 0 ? methods_transaction.filter((item) => item["id"] == "Crédito")[0].value : 0
        let valueReceive = methods_transaction.filter((item) => item["id"] == "Saldo" ).length != 0 ? methods_transaction.filter((item) => item["id"] == "Saldo")[0].value : 0
        
        if (valueCredit && methods_transaction.length == 1) {
            throw new Error("Não é possivel pagar somente com crédito")
        }

        if (client_id) {
            const listPendingService = new ListTransactionsPendingService

            await listPendingService.execute({club_id, client_id})

            if (valueReceive) {
                const paymentReceivesService = new PaymentReceivesService

                await paymentReceivesService.execute({
                    value: valueReceive, client_id, club_id
                })
            }
        }
       
        const paymentPendingService = new PaymentPendingService

        const transaction = await paymentPendingService.execute({
            club_id, date_payment, methods_transaction, observation, valueReceive, client_id
        })

        return res.json(transaction)
    }
}

export { PaymentPendingTransactionController }