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
        const { id, chair, tournament_id, timechip, paid, value, passport, jackpot,
            dealer, passport_method, jackpot_method, dealer_method, passport_percentage,
            jackpot_percentage, dealer_percentage, passport_paid,
            jackpot_paid, dealer_paid, super_addOn, addOn, buyin, rebuy, rebuyDuplo,
            date_payment, observation, methods_transaction} = req.body

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
                paid: dealer_paid, value: tournament.dealer_value, type: "dealer", methods_transaction: {
                    name: dealer_method,
                    value: tournament.dealer_value,
                    percentage: dealer_percentage
                }, client_id: id, club_id, date_payment, observation, items_transaction: {
                    name: "dealer",
                    amount: 1,
                    value: tournament.dealer_value,
                }, operation: "entrada"
            })
        }

        if (passport) {
            const createPassportService = new CreatePassportService

            await createPassportService.execute({
                paid: passport_paid, value: tournament.passport_value, type: "passport", methods_transaction: {
                    name: passport_method,
                    value: tournament.passport_value,
                    percentage: passport_percentage
                }, client_id: id, club_id, date_payment, observation, items_transaction: {
                    name: "passport",
                    amount: 1,
                    value: tournament.passport_value,
                }, operation: "entrada"
            })
        }

        if (jackpot) {
            const createJackpotService = new CreateJackpotService

            await createJackpotService.execute({
                paid: jackpot_paid, value: tournament.jackpot_value, type: "jackpot", methods_transaction: {
                    name: jackpot_method,
                    value: tournament.jackpot_value,
                    percentage: jackpot_percentage
                }, client_id: id, club_id, date_payment, observation, items_transaction: {
                    name: "jackpot",
                    amount: 1,
                    value: tournament.jackpot_value,
                }, operation: "entrada"
            })
        }

        let items_transaction = [] 

        if (addOn) {
            items_transaction.push({
                name: "torneio-add-on",
                amount: addOn,
                value: tournament.addOn_value,
            })
            token+=tournament.addOn_token
        }

        if (super_addOn) {
            items_transaction.push({
                name: "torneio-super-add-on",
                amount: super_addOn,
                value: tournament.super_addOn_value,
            })
            token+=tournament.super_addOn_token
        }

        if (buyin) {
            items_transaction.push({
                name: "torneio-buyin",
                amount: buyin,
                value: tournament.buyin_value,
            })
            token+=tournament.buyin_token
        }

        if (rebuy) {
            items_transaction.push({
                name: tournament.is_rebuy ? "torneio-rebuy" : "torneio-reentrada",
                amount: rebuy,
                value: tournament.rebuy_value,
            })
            token+=tournament.rebuy_token*rebuy
        }

        if (rebuyDuplo) {
            items_transaction.push({
                name: tournament.is_rebuy ? "torneio-rebuy-duplo" : "torneio-reentrada-dupla",
                amount: rebuyDuplo,
                value: tournament.rebuyDuplo_value,
            })
        }

        const createTransactionService = new CreateTransactionService
        
        const transaction = await createTransactionService.execute({
                paid, value: tournament.rebuyDuplo_value, type: "clube", methods_transaction: methods_transaction || [], items_transaction, client_id: id, club_id, date_payment, observation, operation: "entrada"
        })

        const buyTournamentService = new BuyTournamentService

        await buyTournamentService.execute({
            transaction, value, token, jackpot, passport, super_addOn, dealer, tournament, addOn, buyin, rebuy, rebuyDuplo, client_id: id
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