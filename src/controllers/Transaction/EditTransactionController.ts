import { Request, Response } from 'express';
import { EditTransactionService } from '../../services/Transaction/EditTransactionService';

class EditTransactionController {
    async handle(req: Request, res: Response) {
        const { id } = req.params
        const { method, observation } = req.body

        let club_id = req.club_id

        const editTransactionService = new EditTransactionService

        const transaction = await editTransactionService.execute({
            id, club_id, method, observation
        })

        return res.json(transaction)
    }
}

export { EditTransactionController } 