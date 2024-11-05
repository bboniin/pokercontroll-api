import { Request, Response } from 'express';
import { ListMethodsService } from '../../services/Method/ListMethodsService';

class ListMethodsController {
    async handle(req: Request, res: Response) {

        let { page, all } = req.query
        let club_id = req.club_id

        const listMethodsService = new ListMethodsService

        const methods = await listMethodsService.execute({
            club_id, page: Number(page) > 0 ? Number(page) : 0, all: all == "true" ? true : false
        })

        return res.json(methods)
    }
}

export { ListMethodsController }