import { Request, Response } from 'express';
import { ExitClientTournamentService } from '../../services/Tournament/ExitClientTournamentService';
import { CreateTransactionService } from '../../services/Transaction/CreateTransactionService';

class ExitClientTournamentController {
    async handle(req: Request, res: Response) {
        const { client_id } = req.params
        const { tournament_id, position, paid } = req.body

        let club_id = req.club_id

        const exitClientTournamentService = new ExitClientTournamentService

        const {tournament, award} = await exitClientTournamentService.execute({
            client_id, club_id, tournament_id, position
        })


        if (award) {
            const createTransactionService = new CreateTransactionService

            await createTransactionService.execute({
                paid, value: award, type: "torneio", method: 'clube', client_id, club_id, date_payment: new Date(), observation: "", operation: "saida"
            })
        }

        return res.json(tournament)
    }
}

export { ExitClientTournamentController }