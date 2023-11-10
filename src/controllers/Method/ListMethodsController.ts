import { Request, Response } from 'express';
import { ListMethodsService } from '../../services/Method/ListMethodsService';

class ListMethodsController {
    async handle(req: Request, res: Response) {

        let club_id = req.club_id

        const listMethodsService = new ListMethodsService

        const methods = await listMethodsService.execute({
            club_id
        })

        return res.json(methods)
    }
}

export { ListMethodsController }