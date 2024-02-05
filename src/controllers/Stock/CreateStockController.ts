import { Request, Response } from 'express';
import { CreateStockService } from '../../services/Stock/CreateStockService';

class CreateStockController {
    async handle(req: Request, res: Response) {
        const { amount, supplier_id, product_id } = req.body

        let club_id = req.club_id

        const createStockService = new CreateStockService

        const stock = await createStockService.execute({
            amount: amount ? parseInt(amount) : 0, supplier_id, product_id, club_id
        })
        return res.json(stock)
    }
}

export { CreateStockController }