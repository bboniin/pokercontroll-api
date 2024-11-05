import { Request, Response } from 'express';
import { CreateTransactionService } from '../../services/Transaction/CreateTransactionService';
import { GetTournamentService } from '../../services/Tournament/GetTournamentService';
import { BuyTournamentService } from '../../services/Tournament/BuyTournamentService';
import { VerifyCreditTransactionService } from '../../services/Transaction/VerifyCreditTransactionService';
import { VerifyBuyTournamentService } from '../../services/Tournament/VerifyBuyTournamentService';
import { CreatePassportService } from '../../services/Transaction/CreatePassportService';
import { CreateJackpotService } from '../../services/Transaction/CreateJackpotService';
import { CreateDealerService } from '../../services/Transaction/CreateDealerService';
import { getMethodsPay } from '../../utils/functions';
import { PaymentReceivesService } from '../../services/Transaction/PaymentReceivesService';

class BuyTournamentController {
    async handle(req: Request, res: Response) {
        const { value, purchases, methods_transaction, client_id, date_payment, observation, tournament_id } = req.body

        let club_id = req.club_id

        let valueCredit = methods_transaction.filter((item) => item["id"] == "Crédito" ).length != 0 ? methods_transaction.filter((item) => item["id"] == "Crédito")[0].value : 0

        if (valueCredit) {
            const verifyCreditTransactionService = new VerifyCreditTransactionService

            await verifyCreditTransactionService.execute({
                client_id, club_id, value: valueCredit
            })
        }

        let valueReceive = methods_transaction.filter((item) => item["id"] == "Saldo" ).length != 0 ? methods_transaction.filter((item) => item["id"] == "Saldo")[0].value : 0
        
        const paymentDebtsService = new PaymentReceivesService

        if (valueReceive) {
            await paymentDebtsService.execute({
                value: valueReceive, client_id, club_id
            })
        }

        let methods_transactionC = methods_transaction.filter((item) => item["id"] != "Crédito") 

        const verifyBuyTournamentService = new VerifyBuyTournamentService

        await verifyBuyTournamentService.execute({
            client_id, purchases, tournament_id: tournament_id
        })

        let totalToken = 0
        let totalValue = 0

        purchases.map( async (item)=>{
            switch(item.cashier){
                case "dealer": {
                    let { payCredit, methodsPay, methodsC } = await getMethodsPay(item.value*item.amount, methods_transactionC)
                    const createDealerService = new CreateDealerService
                    await createDealerService.execute({
                        paid: payCredit ? false : true, value: item.value*item.amount, type: item.name, methods_transaction:
                        methodsPay, client_id, sector_id: tournament_id, club_id, date_payment, observation, items_transaction: [{
                            name: item.name,
                            amount: item.amount,
                            value: item.value*item.amount,
                        }], operation: "entrada", valueReceive, valueDebit: 0
                    })
                    methods_transactionC = methodsC
                    break;
                }
                case "passport": {
                    let { payCredit, methodsPay, methodsC } = await getMethodsPay(item.value*item.amount, methods_transactionC)
                    const createPassportService = new CreatePassportService
                    await createPassportService.execute({
                        paid: payCredit ? false : true, value: item.value*item.amount, type: item.name, methods_transaction:
                        methodsPay, client_id, sector_id: tournament_id, club_id, date_payment, observation, items_transaction: [{
                            name: item.name,
                            amount: item.amount,
                            value: item.value*item.amount,
                        }], operation: "entrada", valueReceive, valueDebit: 0
                    })
                    methods_transactionC = methodsC
                    break;
                }
                case "jackpot": {
                    let { payCredit, methodsPay, methodsC } = await getMethodsPay(item.value*item.amount, methods_transactionC)
                    const createJackpotService = new CreateJackpotService
                    await createJackpotService.execute({
                        paid: payCredit ? false : true, value: item.value*item.amount, type: item.name, methods_transaction:
                        methodsPay, client_id, sector_id: tournament_id, club_id, date_payment, observation, items_transaction: [{
                            name: item.name,
                            amount: item.amount,
                            value: item.value*item.amount,
                        }], operation: "entrada", valueReceive, valueDebit: 0
                    })
                    methods_transactionC = methodsC
                    break;
                }
                default: {
                    let { payCredit, methodsPay, methodsC } = await getMethodsPay(item.value*item.amount, methods_transactionC)
                    const createTransactionService = new CreateTransactionService
                    await createTransactionService.execute({
                        paid: payCredit ? false : true, value: item.value*item.amount, type: item.name, methods_transaction:
                        methodsPay, client_id, sector_id: tournament_id, club_id, date_payment, observation, items_transaction: [{
                            name: item.name,
                            amount: item.amount,
                            value: item.value*item.amount,
                        }], operation: "entrada", valueReceive, valueDebit: 0
                    })
                    methods_transactionC = methodsC
                    totalValue -= item.value*item.amount
                    totalToken += item.token*item.amount
                    break;
                }
            }
        })

        return "Compra realizada com sucesso"
    }
}

export { BuyTournamentController }