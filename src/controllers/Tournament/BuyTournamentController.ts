import { Request, Response } from 'express';
import { CreateTransactionService } from '../../services/Transaction/CreateTransactionService';

class BuyTournamentController {
    async handle(req: Request, res: Response) {
        const { paid, type, method, client_id, date_payment, observation } = req.body

        let club_id = req.club_id

        let value = 0

        const types = {
            "torneio-buyin": 25,
            "torneio-rebuy": 50,
            "torneio-rebuy-duplo": 100,
            "torneio-add-on": 150,
        }

        if (types[type]) {
            value = types[type]
        }
         
        const createTransactionService = new CreateTransactionService

        const transaction = await createTransactionService.execute({
            paid, value, type, method, client_id, club_id, date_payment, observation, operation: "entrada"
        })

        return res.json(transaction)
    }
}

export { BuyTournamentController }