import { Request, Response } from 'express';
import { CreateTransactionService } from '../../services/Transaction/CreateTransactionService';
import { GetTournamentService } from '../../services/Tournament/GetTournamentService';
import { BuyTournamentService } from '../../services/Tournament/BuyTournamentService';
import { VerifyCreditTransactionService } from '../../services/Transaction/VerifyCreditTransactionService';
import { VerifyBuyTournamentService } from '../../services/Tournament/VerifyBuyTournamentService';
import { CreatePassportService } from '../../services/Transaction/CreatePassportService';
import { CreateJackpotService } from '../../services/Transaction/CreateJackpotService';

class BuyTournamentController {
    async handle(req: Request, res: Response) {
        const { paid, value, passport, jackpot, addOn, buyin, rebuy, rebuyDuplo , method, client_id, date_payment, observation, tournament_id } = req.body

        let club_id = req.club_id

        let token = 0

        if (!paid) {
            const verifyCreditTransactionService = new VerifyCreditTransactionService

            await verifyCreditTransactionService.execute({
                client_id, club_id, value
            })
        }

        const getTournamentService = new GetTournamentService

        const tournament = await getTournamentService.execute({
            id: tournament_id, club_id
        })

        const verifyBuyTournamentService = new VerifyBuyTournamentService

        await verifyBuyTournamentService.execute({
            client_id, passport, jackpot, addOn, buyin, rebuy, rebuyDuplo, tournament
        })

        if (passport) {
            const createPassportService = new CreatePassportService

            await createPassportService.execute({
                paid, value: 10, type: "passport", method, client_id, club_id, date_payment, observation, operation: "entrada"
            })
        }

        if (jackpot) {
            const createJackpotService = new CreateJackpotService

            await createJackpotService.execute({
                paid, value: 10, type: "jackpot", method, client_id, club_id, date_payment, observation, operation: "entrada"
            })
        }

        if (addOn) {
            const createTransactionService = new CreateTransactionService

            await createTransactionService.execute({
                paid, value: tournament.addOn_value, type: "torneio-add-on", method, client_id, club_id, date_payment, observation, operation: "entrada"
            })

            token+=tournament.addOn_token
        }

        if (buyin) {
            const createTransactionService = new CreateTransactionService

            await createTransactionService.execute({
                paid, value: tournament.buyin_value, type: "torneio-buyin", method, client_id, club_id, date_payment, observation, operation: "entrada"
            })

            token+=tournament.buyin_token
        }

        if (rebuy) {
            for (let i = 0; i < rebuy; i++){
                const createTransactionService = new CreateTransactionService

                await createTransactionService.execute({
                    paid, value: tournament.rebuy_value, type: "torneio-rebuy", method, client_id, club_id, date_payment, observation, operation: "entrada"
                })

                token+=tournament.rebuy_token
            }
        }

        if (rebuyDuplo) {
            for (let i = 0; i < rebuyDuplo; i++){
                const createTransactionService = new CreateTransactionService

                await createTransactionService.execute({
                    paid, value: tournament.rebuyDuplo_value, type: "torneio-rebuy-duplo", method, client_id, club_id, date_payment, observation, operation: "entrada"
                })

                token+=tournament.rebuyDuplo_token
            }
        }

        const buyTournamentService = new BuyTournamentService

        const tournamentC = await buyTournamentService.execute({
            value, token, jackpot, passport, tournament, addOn, buyin, rebuy, rebuyDuplo, client_id
        })

        return res.json(tournamentC)
    }
}

export { BuyTournamentController }