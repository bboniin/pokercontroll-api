import { Request, Response } from 'express';
import { DeleteCategoryService } from '../../services/Category/DeleteCategoryService';

class DeleteCategoryController {
    async handle(req: Request, res: Response) {

        const { category_id } = req.params

        let club_id = req.club_id

        const deleteCategoryService = new DeleteCategoryService

        const category = await deleteCategoryService.execute({
            club_id, category_id
        })

        return res.json(category)
    }
}

export { DeleteCategoryController }