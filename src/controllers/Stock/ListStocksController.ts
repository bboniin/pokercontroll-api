import { Request, Response } from 'express';
import { ListStocksService } from '../../services/Stock/ListStocksService';

class ListStocksController {
    async handle(req: Request, res: Response) {

        let club_id = req.club_id

        const listStocksService = new ListStocksService

        const stocks = await listStocksService.execute({
            club_id
        })

        return res.json(stocks)
    }
}

export { ListStocksController }