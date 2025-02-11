import { Request, Response } from 'express';
import { ListCategoriesService } from '../../services/Category/ListCategoriesService';

class ListCategoriesController {
    async handle(req: Request, res: Response) {

        let club_id = req.club_id

        const listCategoriesService = new ListCategoriesService

        const categories = await listCategoriesService.execute({
            club_id
        })

        return res.json(categories)
    }
}

export { ListCategoriesController }