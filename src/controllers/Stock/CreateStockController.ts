import { Request, Response } from 'express';
import { CreateStockService } from '../../services/Stock/CreateStockService';
import { CreateTransactionClubeService } from '../../services/Transaction/CreateTransactionClubeService';

class CreateStockController {
    async handle(req: Request, res: Response) {
        const { amount, supplier_id, product_id, cost_value, methods_transaction, paid } = req.body

        let club_id = req.club_id

        const createStockService = new CreateStockService

        let cost_value_ok = cost_value ? parseFloat(cost_value) : 0
        let amount_ok = amount ? parseFloat(amount) : 0
        let value_ok = cost_value_ok*amount_ok

        const stock = await createStockService.execute({
            cost_value: cost_value_ok, amount: amount_ok, supplier_id, product_id, club_id
        })

        const createTransactionClubeService = new CreateTransactionClubeService

        await createTransactionClubeService.execute({
            paid, value: value_ok, type: "clube", methods_transaction, items_transaction: {
                name: `Estoque para ${stock.name}`,
                amount: amount_ok,
                value: cost_value_ok
            }, club_id, date_payment: new Date(), observation: "", operation: "saida"
        })

        return res.json(stock)
    }
}

export { CreateStockController }