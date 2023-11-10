import { Request, Response } from 'express';
import { EditCategoryService } from '../../services/Category/EditCategoryService';

class EditCategoryController {
    async handle(req: Request, res: Response) {
        const { category_id } = req.params
        const { name } = req.body

        let club_id = req.club_id

        const editCategoryService = new EditCategoryService

        const category = await editCategoryService.execute({
            name, club_id, category_id
        })

        return res.json(category)
    }
}

export { EditCategoryController }