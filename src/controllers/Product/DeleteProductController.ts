import { Request, Response } from 'express';
import { DeleteProductService } from '../../services/Product/DeleteProductService';

class DeleteProductController {
    async handle(req: Request, res: Response) {

        const { product_id } = req.params

        let club_id = req.club_id

        const deleteProductService = new DeleteProductService

        const product = await deleteProductService.execute({
            club_id, product_id
        })

        return res.json(product)
    }
}

export { DeleteProductController }