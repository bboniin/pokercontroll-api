import { Request, Response } from 'express';
import { CreateMethodService } from '../../services/Method/CreateMethodService';

class CreateMethodController {
    async handle(req: Request, res: Response) {
        const { name, percentage, identifier} = req.body

        let club_id = req.club_id

        const createMethodService = new CreateMethodService

        const method = await createMethodService.execute({
            name, percentage: percentage ? parseFloat(percentage) : 0, identifier, club_id
        })
        return res.json(method)
    }
}

export { CreateMethodController }