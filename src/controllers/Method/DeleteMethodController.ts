import { Request, Response } from 'express';
import { DeleteMethodService } from '../../services/Method/DeleteMethodService';

class DeleteMethodController {
    async handle(req: Request, res: Response) {

        const { method_id } = req.params

        let club_id = req.club_id

        const deleteMethodService = new DeleteMethodService

        const method = await deleteMethodService.execute({
            club_id, method_id
        })

        return res.json(method)
    }
}

export { DeleteMethodController }