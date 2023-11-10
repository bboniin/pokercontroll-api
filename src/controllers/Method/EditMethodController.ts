import { Request, Response } from 'express';
import { EditMethodService } from '../../services/Method/EditMethodService';

class EditMethodController {
    async handle(req: Request, res: Response) {
        const { method_id } = req.params
        const { name, percentage, type, identifier } = req.body

        let club_id = req.club_id

        const editMethodService = new EditMethodService

        const method = await editMethodService.execute({
            name, percentage: percentage ? parseFloat(percentage) : 0, type, identifier, club_id, method_id
        })

        return res.json(method)
    }
}

export { EditMethodController }