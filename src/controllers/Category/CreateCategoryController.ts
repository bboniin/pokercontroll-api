import { Request, Response } from 'express';
import { CreateCategoryService } from '../../services/Category/CreateCategoryService';

class CreateCategoryController {
    async handle(req: Request, res: Response) {
        const { name } = req.body

        let club_id = req.club_id

        const createCategoryService = new CreateCategoryService

        const category = await createCategoryService.execute({
            name, club_id
        })
        return res.json(category)
    }
}

export { CreateCategoryController }