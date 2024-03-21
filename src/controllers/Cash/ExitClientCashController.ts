import { Request, Response } from 'express';
import { ExitClientCashService } from '../../services/Cash/ExitClientCashService';
import { CreateTransactionService } from '../../services/Transaction/CreateTransactionService';
import { PaymentDebtsService } from '../../services/Transaction/PaymentDebtsService';

class ExitClientCashController {
    async handle(req: Request, res: Response) {
        const { client_id } = req.params
        const { sector_id, value, methods_transaction, date_payment, observation } = req.body

        let club_id = req.club_id

        let valueDebit = methods_transaction.filter((item) => item["id"] == "Pag Dívida" ).length != 0 ? methods_transaction.filter((item) => item["id"] == "Pag Dívida")[0].value : 0
        let valueCredit = methods_transaction.filter((item) => item["id"] == "Crédito").length != 0 ? methods_transaction.filter((item) => item["id"] == "Crédito")[0].value : 0
        
        const paymentDebtsService = new PaymentDebtsService

        if (valueDebit) {
            await paymentDebtsService.execute({
                value: valueDebit, client_id, club_id
            })
        }

        const createTransactionService = new CreateTransactionService

        await createTransactionService.execute({
            paid: valueDebit == value ? true : valueCredit ? false : true, value, type: "clube", methods_transaction, items_transaction: [{
                name: "cash",
                amount: 1,
                value: value
            }], client_id, sector_id, club_id, date_payment, observation, operation: "saida"
        })

        const exitClientCashService = new ExitClientCashService

        const client = await exitClientCashService.execute({
            client_id, club_id
        })

        if (client["photo"]) {
            client["photo_url"] = "https://pokercontrol-data.s3.sa-east-1.amazonaws.com/" + client["photo"];
        }

        return res.json(client)
    }
}

export { ExitClientCashController }