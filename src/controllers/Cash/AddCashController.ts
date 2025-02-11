import { Request, Response } from 'express';
import { CreateTransactionService } from '../../services/Transaction/CreateTransactionService';
import { MoveCashService } from '../../services/Cash/MoveCashService';
import { VerifyCreditTransactionService } from '../../services/Transaction/VerifyCreditTransactionService';
import { PaymentReceivesService } from '../../services/Transaction/PaymentReceivesService';

class AddCashController {
    async handle(req: Request, res: Response) {
        const { chair, id, sector_id, value, methods_transaction, date_payment, observation } = req.body

        let club_id = req.club_id

        let valueCredit = methods_transaction.filter((item) => item["id"] == "Crédito" ).length != 0 ? methods_transaction.filter((item) => item["id"] == "Crédito")[0].value : 0

        if (valueCredit) {
            const verifyCreditTransactionService = new VerifyCreditTransactionService

            await verifyCreditTransactionService.execute({
                client_id: id, club_id, value: valueCredit
            })
        }

        let valueReceive = methods_transaction.filter((item) => item["id"] == "Saldo" ).length != 0 ? methods_transaction.filter((item) => item["id"] == "Saldo")[0].value : 0
        
        const paymentDebtsService = new PaymentReceivesService

        if (valueReceive) {
            await paymentDebtsService.execute({
                value: valueReceive, client_id: id, club_id
            })
        }
        
        const createTransactionService = new CreateTransactionService

        await createTransactionService.execute({
            paid: valueReceive == value ? true : valueCredit ? false : true, value, type: "clube", methods_transaction, items_transaction: [{
                name: "cash",
                amount: 1,
                value: value
            }], client_id: id, sector_id, club_id, date_payment, observation, operation: "entrada", valueReceive, valueDebit: 0
        })

        const moveCashService = new MoveCashService

        const client = await moveCashService.execute({
            chair, id, club_id, chair_initial: ""
        })

        if (client["photo"]) {
            client["photo_url"] = "https://pokercontrol-data.s3.sa-east-1.amazonaws.com/" + client["photo"];
        }

        return res.json(client)
    }
}

export { AddCashController }