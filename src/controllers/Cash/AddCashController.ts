import { Request, Response } from 'express';
import { CreateTransactionService } from '../../services/Transaction/CreateTransactionService';
import { MoveCashService } from '../../services/Cash/MoveCashService';

class AddCashController {
    async handle(req: Request, res: Response) {
        const { chair, id, paid, sector_id, value, methods_transaction, date_payment, observation } = req.body

        let club_id = req.club_id

        const createTransactionService = new CreateTransactionService

        await createTransactionService.execute({
            paid, value, type: "clube", methods_transaction, items_transaction: [{
                name: "cash",
                amount: 1,
                value: value
            }], client_id: id, sector_id, club_id, date_payment, observation, operation: "entrada"
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