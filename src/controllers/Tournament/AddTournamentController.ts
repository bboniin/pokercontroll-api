import { Request, Response } from 'express';
import { AddTournamentService } from '../../services/Tournament/AddTournamentService';
import { VerifyCreditTransactionService } from '../../services/Transaction/VerifyCreditTransactionService';
import { GetTournamentService } from '../../services/Tournament/GetTournamentService';
import { CreateDealerService } from '../../services/Transaction/CreateDealerService';
import { CreatePassportService } from '../../services/Transaction/CreatePassportService';
import { CreateJackpotService } from '../../services/Transaction/CreateJackpotService';
import { CreateTransactionService } from '../../services/Transaction/CreateTransactionService';
import { BuyTournamentService } from '../../services/Tournament/BuyTournamentService';
import { GetClientService } from '../../services/Client/GetClientService';

class AddTournamentController {
    async handle(req: Request, res: Response) {
        const { id, chair, tournament_id, timechip, paid, value, passport, jackpot, dealer, super_addOn, addOn, buyin, rebuy, rebuyDuplo , method, date_payment, observation, } = req.body

        let club_id = req.club_id

        if (!paid) {
            const verifyCreditTransactionService = new VerifyCreditTransactionService

            await verifyCreditTransactionService.execute({
                client_id: id, club_id, value
            })
        }

        const getTournamentService = new GetTournamentService

        const tournament = await getTournamentService.execute({
            id: tournament_id, club_id
        })


        const addTournamentService = new AddTournamentService

        await addTournamentService.execute({
            chair, id, tournament_id, club_id, timechip
        })

        let token = 0

        if (dealer) {
            const createDealerService = new CreateDealerService

            await createDealerService.execute({
                paid, value: tournament.dealer_value, type: "dealer", method, client_id: id, club_id, date_payment, observation, operation: "entrada"
            })
        }

        if (passport) {
            const createPassportService = new CreatePassportService

            await createPassportService.execute({
                paid, value: tournament.passport_value, type: "passport", method, client_id: id, club_id, date_payment, observation, operation: "entrada"
            })
        }

        if (jackpot) {
            const createJackpotService = new CreateJackpotService

            await createJackpotService.execute({
                paid, value: tournament.jackpot_value, type: "jackpot", method, client_id: id, club_id, date_payment, observation, operation: "entrada"
            })
        }

        if (addOn) {
            const createTransactionService = new CreateTransactionService

            await createTransactionService.execute({
                paid, value: tournament.addOn_value, type: "torneio-add-on", method, client_id: id, club_id, date_payment, observation, operation: "entrada"
            })

            token+=tournament.addOn_token
        }

        if (super_addOn) {
            const createTransactionService = new CreateTransactionService

            await createTransactionService.execute({
                paid, value: tournament.super_addOn_value, type: "torneio-add-on", method, client_id: id, club_id, date_payment, observation, operation: "entrada"
            })

            token+=tournament.super_addOn_token
        }

        if (buyin) {
            const createTransactionService = new CreateTransactionService

            await createTransactionService.execute({
                paid, value: tournament.buyin_value, type: "torneio-buyin", method, client_id: id, club_id, date_payment, observation, operation: "entrada"
            })

            token+=tournament.buyin_token
        }

        if (rebuy) {
            const type = tournament.is_rebuy ? "torneio-rebuy" : "torneio-reentrada"
            for (let i = 0; i < rebuy; i++){
                const createTransactionService = new CreateTransactionService

                await createTransactionService.execute({
                    paid, value: tournament.rebuy_value, type: type, method, client_id: id, club_id, date_payment, observation, operation: "entrada"
                })

                token+=tournament.rebuy_token
            }
        }

        if (rebuyDuplo) {
            const type = tournament.is_rebuy ? "torneio-rebuy-duplo" : "torneio-reentrada-dupla"
            for (let i = 0; i < rebuyDuplo; i++){
                const createTransactionService = new CreateTransactionService

                await createTransactionService.execute({
                    paid, value: tournament.rebuyDuplo_value, type: type, method, client_id: id, club_id, date_payment, observation, operation: "entrada"
                })

                token+=tournament.rebuyDuplo_token
            }
        }

        const buyTournamentService = new BuyTournamentService

        await buyTournamentService.execute({
            value, token, jackpot, passport, super_addOn, dealer, tournament, addOn, buyin, rebuy, rebuyDuplo, client_id: id
        })

        const getClientService = new GetClientService

        const client = await getClientService.execute({
            club_id, client_id: id
        })

        if (client["photo"]) {
            client["photo_url"] = "https://pokercontroll.s3.sa-east-1.amazonaws.com/" + client["photo"];
        }

        return res.json(client)
    }
}

export { AddTournamentController }