import { Request, Response } from 'express';
import { EditProductService } from '../../services/Product/EditProductService';

class EditProductController {
    async handle(req: Request, res: Response) {
        const { product_id } = req.params
        const { name, value, amount, category_id } = req.body

        let photo = ""

        if (req.file) {
            photo = req.file.filename
        }

        let club_id = req.club_id

        const editProductService = new EditProductService

        const product = await editProductService.execute({
            name, value: value ? parseFloat(value) : 0, category_id, amount: amount ? parseFloat(amount) : 0, photo, club_id, product_id
        })

        if (product["photo"]) {
            product["photo_url"] = "https://pokercontroll.s3.sa-east-1.amazonaws.com/" + product["photo"];
        }

        return res.json(product)
    }
}

export { EditProductController }