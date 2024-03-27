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
import { getMethodsPay } from '../../utils/functions';
import { PaymentReceivesService } from '../../services/Transaction/PaymentReceivesService';

class AddTournamentController {
    async handle(req: Request, res: Response) {
        const { id, chair, tournament_id, timechip, value, passport, jackpot,
            dealer, super_addOn, addOn, buyin, rebuy, rebuyDuplo, buyin_value, 
            date_payment, observation, methods_transaction} = req.body

        let club_id = req.club_id

        const getTournamentService = new GetTournamentService

        const tournament = await getTournamentService.execute({
            id: tournament_id, club_id
        })

        let valueTotal = value
        let valueCredit = methods_transaction.filter((item) => item["id"] == "Crédito" ).length != 0 ? methods_transaction.filter((item) => item["id"] == "Crédito")[0].value : 0

        if (valueCredit) {
            const verifyCreditTransactionService = new VerifyCreditTransactionService

            await verifyCreditTransactionService.execute({
                client_id: id, club_id, value: valueCredit
            })
        }

        let valueReceive = methods_transaction.filter((item) => item["id"] == "Saldo" ).length != 0 ? methods_transaction.filter((item) => item["id"] == "Saldo")[0].value : 0
        
        const paymentDebtsService = new PaymentReceivesService

        if (valueReceive) {
            await paymentDebtsService.execute({
                value: valueReceive, client_id: id, club_id
            })
        }
        
        let methods_transactionC = methods_transaction.filter((item) => item["id"] != "Crédito") 

        const addTournamentService = new AddTournamentService

        await addTournamentService.execute({
            chair, id, tournament_id, club_id
        })

        let token = timechip ? tournament.timechip : 0

        if (dealer) {
            let {  methodsPay, payCredit, methodsC } = await getMethodsPay(tournament.dealer_value, methods_transactionC)
            const createDealerService = new CreateDealerService
            await createDealerService.execute({
                paid: payCredit ? false : true, value: tournament.dealer_value, type: "dealer", methods_transaction:
                methodsPay, client_id: id, sector_id: tournament_id, club_id, date_payment, observation, items_transaction: {
                    name: "dealer",
                    amount: 1,
                    value: tournament.dealer_value,
                }, operation: "entrada", valueReceive, valueDebit: 0
            })
            methods_transactionC = methodsC
            valueTotal -= tournament.dealer_value
        }

        if (passport) {
            let { methodsPay, payCredit, methodsC } = await getMethodsPay(tournament.passport_value, methods_transactionC)
            const createPassportService = new CreatePassportService
            await createPassportService.execute({
                paid: payCredit ? false : true, value: tournament.passport_value, type: "passport", methods_transaction:
                methodsPay, client_id: id, sector_id: tournament_id, club_id, date_payment, observation, items_transaction: {
                    name: "passport",
                    amount: 1,
                    value: tournament.passport_value,
                }, operation: "entrada", valueReceive, valueDebit: 0
            })
            methods_transactionC = methodsC
            valueTotal -= tournament.passport_value
        }

        if (jackpot) {
            let { methodsPay, payCredit, methodsC } = await getMethodsPay(tournament.jackpot_value, methods_transactionC)
            const createJackpotService = new CreateJackpotService
            await createJackpotService.execute({
                paid: payCredit ? false : true, value: tournament.jackpot_value, type: "jackpot", methods_transaction: 
                methodsPay, client_id: id, sector_id: tournament_id, club_id, date_payment, observation, items_transaction: {
                    name: "jackpot",
                    amount: 1,
                    value: tournament.jackpot_value,
                }, operation: "entrada", valueReceive, valueDebit: 0
            })
            methods_transactionC = methodsC
            valueTotal -= tournament.jackpot_value
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
                value: buyin_value == 0 ? buyin_value : tournament.buyin_value,
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
        
        let { methodsPay, payCredit } = await getMethodsPay(valueTotal, methods_transactionC)
        const transaction = await createTransactionService.execute({
            paid: payCredit ? false : true, value: valueTotal, type: "clube", methods_transaction: 
            methodsPay, items_transaction, client_id: id, sector_id: tournament_id, club_id,
            date_payment, observation, operation: "entrada", valueReceive, valueDebit: 0
        })

        const buyTournamentService = new BuyTournamentService

        await buyTournamentService.execute({
            transaction_id: transaction.id, value, token, jackpot, passport, super_addOn, dealer, tournament, addOn, buyin, rebuy, rebuyDuplo, client_id: id
        })

        const getClientService = new GetClientService

        const {client} = await getClientService.execute({
            club_id, client_id: id, page: 0
        })

        if (client["photo"]) {
            client["photo_url"] = "https://pokercontrol-data.s3.sa-east-1.amazonaws.com/" + client["photo"];
        }

        return res.json(client)
    }
}

export { AddTournamentController }