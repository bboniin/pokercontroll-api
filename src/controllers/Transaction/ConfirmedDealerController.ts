import { Request, Response } from 'express';
import { ConfirmedPassportService } from '../../services/Transaction/ConfirmedPassportService';

class ConfirmedPassportController {
    async handle(req: Request, res: Response) {
        const { id } = req.params
        const { methods_transaction } = req.body

        let club_id = req.club_id

        const confirmedPassportService = new ConfirmedPassportService

        const passport = await confirmedPassportService.execute({
            id, club_id, methods_transaction
        })

        return res.json(passport)
    }
}

export { ConfirmedPassportController }