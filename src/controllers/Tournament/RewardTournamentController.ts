import { Request, Response } from 'express';
import { CreateTransactionService } from '../../services/Transaction/CreateTransactionService';

class RewardTournamentController {
    async handle(req: Request, res: Response) {
        const { paid, value, client_id, methods_transaction, date_payment, observation, } = req.body

        let club_id = req.club_id

        const createTransactionService = new CreateTransactionService

        const transaction = await createTransactionService.execute({
            paid, value, type: "clube", methods_transaction: methods_transaction || [], items_transaction: [{
                name: "tournament",
                value: value,
                amount: 1
            }], client_id, club_id, date_payment, observation, operation: "saida"
        })

        return res.json(transaction)
    }
}

export { RewardTournamentController }