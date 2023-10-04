import { Request, Response } from 'express';
import { CreateTransactionService } from '../../services/Transaction/CreateTransactionService';
import { GetTournamentService } from '../../services/Tournament/GetTournamentService';
import { BuyTournamentService } from '../../services/Tournament/BuyTournamentService';

class BuyTournamentController {
    async handle(req: Request, res: Response) {
        const { paid, type, method, client_id, date_payment, observation, tournament_id } = req.body

        let club_id = req.club_id

        let value = 0
        let token = 0

        const getTournamentService = new GetTournamentService

        const tournament = await getTournamentService.execute({
            id: tournament_id, club_id
        })

        const values = {
            "torneio-buyin": tournament.buyin_value,
            "torneio-rebuy": tournament.rebuy_value,
            "torneio-rebuy-duplo": tournament.rebuyDuplo_value,
            "torneio-add-on": tournament.addOn_value,
        }

        if (values[type]) {
            value = values[type]
        }

        const tokens = {
            "torneio-buyin": tournament.buyin_token,
            "torneio-rebuy": tournament.rebuy_token,
            "torneio-rebuy-duplo": tournament.rebuyDuplo_token,
            "torneio-add-on": tournament.addOn_token,
        }

        if (tokens[type]) {
            token = tokens[type]
        }
         
        const createTransactionService = new CreateTransactionService

        await createTransactionService.execute({
            paid, value, type, method, client_id, club_id, date_payment, observation, operation: "entrada"
        })

        const buyTournamentService = new BuyTournamentService

        const tournamentC = await buyTournamentService.execute({
            value, token, tournament
        })

        return res.json(tournamentC)
    }
}

export { BuyTournamentController }