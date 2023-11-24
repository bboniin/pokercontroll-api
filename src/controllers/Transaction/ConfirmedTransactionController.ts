import { Request, Response } from 'express';
import { ConfirmedTransactionService } from '../../services/Transaction/ConfirmedTransactionService';
import { ConfirmedDealerService } from '../../services/Transaction/ConfirmedDealerService';
import { ConfirmedPassportService } from '../../services/Transaction/ConfirmedPassportService';

class ConfirmedTransactionController {
    async handle(req: Request, res: Response) {
        const { id } = req.params
        const { methods_transaction, type } = req.body

        let club_id = req.club_id

        if (type == "clube") {
            const confirmedTransactionService = new ConfirmedTransactionService

            const transaction = await confirmedTransactionService.execute({
                id, club_id, methods_transaction
            })

            return res.json(transaction)
        }

        if (type == "dealer") {

            const confirmedDealerService = new ConfirmedDealerService
    
            const dealer = await confirmedDealerService.execute({
                id, club_id, methods_transaction
            })
    
            return res.json(dealer)
        }

        if (type == "jackpot") {
            const confirmedJackpotService = new ConfirmedPassportService
    
            const jackpot = await confirmedJackpotService.execute({
                id, club_id, methods_transaction
            })
    
            return res.json(jackpot)
        }

        if (type == "passport") {
            const confirmedPassportService = new ConfirmedPassportService
    
            const passport = await confirmedPassportService.execute({
                id, club_id, methods_transaction
            })
    
            return res.json(passport)
        }
        
        throw new Error("Nenhum tipo de caixa foi enviado")

    }
}

export { ConfirmedTransactionController }