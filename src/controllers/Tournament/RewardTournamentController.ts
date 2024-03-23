import { Request, Response } from 'express';
import { CreateTransactionService } from '../../services/Transaction/CreateTransactionService';
import { PaymentDebtsService } from '../../services/Transaction/PaymentDebtsService';

class RewardTournamentController {
    async handle(req: Request, res: Response) {
        const { sector_id, value, client_id, methods_transaction, date_payment, observation, } = req.body

        let club_id = req.club_id

        const createTransactionService = new CreateTransactionService

        let valueCredit = methods_transaction.filter((item) => item["id"] == "Crédito" ).length != 0 ? methods_transaction.filter((item) => item["id"] == "Crédito")[0].value : 0
        let valueDebit = methods_transaction.filter((item) => item["id"] == "Pag Dívida" ).length != 0 ? methods_transaction.filter((item) => item["id"] == "Crédito")[0].value : 0

        const paymentDebtsService = new PaymentDebtsService

        if (valueDebit) {
            await paymentDebtsService.execute({
                value: valueDebit, client_id, club_id
            })
        }
        
        const transaction = await createTransactionService.execute({
            paid: valueDebit == value ? true : valueCredit ? false : true, value, type: "clube", methods_transaction: methods_transaction, items_transaction: [{
                name: "tournament",
                value: value,
                amount: 1
            }], client_id, sector_id, club_id, date_payment, observation, operation: "saida"
        })

        return res.json(transaction)
    }
}

export { RewardTournamentController }