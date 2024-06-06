import { Request, Response } from 'express';
import { ExitClientTournamentService } from '../../services/Tournament/ExitClientTournamentService';
import { CreateTransactionService } from '../../services/Transaction/CreateTransactionService';
import { PaymentDebtsService } from '../../services/Transaction/PaymentDebtsService';

class ExitClientTournamentController {
    async handle(req: Request, res: Response) {
        const { client_id } = req.params
        const { tournament_id, position, sector_id, methods_transaction, datePayment, observation } = req.body

        let club_id = req.club_id

        const exitClientTournamentService = new ExitClientTournamentService

        const { tournament, award } = await exitClientTournamentService.execute({
            client_id, tournament_id, position
        })

        if (award) {
            let valueDebit = methods_transaction.filter((item) => item["id"] == "Pag Dívida" ).length != 0 ? methods_transaction.filter((item) => item["id"] == "Pag Dívida")[0].value : 0
            let valueCredit = methods_transaction.filter((item) => item["id"] == "Crédito").length != 0 ? methods_transaction.filter((item) => item["id"] == "Crédito")[0].value : 0
            
            const paymentDebtsService = new PaymentDebtsService

            if (valueDebit) {
                await paymentDebtsService.execute({
                    value: valueDebit, client_id, club_id
                })
            }

            const createTransactionService = new CreateTransactionService

            await createTransactionService.execute({
            paid: valueDebit == award ? true : valueCredit ? false : true, value: award, type: "clube", methods_transaction: methods_transaction, items_transaction: [{
                    name: "torneio",
                    value: award,
                    amount: 1
                }], client_id, sector_id, club_id, date_payment: datePayment, valueReceive: 0, valueDebit, observation: observation, operation: "saida"
            })
        }

        return res.json(tournament)
    }
}

export { ExitClientTournamentController }