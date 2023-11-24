import { Request, Response } from 'express';
import { ListClubsService } from '../../services/Club/ListClubsService';

class ListClubsController {
    async handle(req: Request, res: Response) {

        let { page, all } = req.query
        let user_id = req.user_id

        const listClubsService = new ListClubsService

        const clubs = await listClubsService.execute({
            user_id, page: Number(page) > 0 ? Number(page) : 0, all: all == "true" ? true : false
        })

        return res.json(clubs)
    }
}

export { ListClubsController }