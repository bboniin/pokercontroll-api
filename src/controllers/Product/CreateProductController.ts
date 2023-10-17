import { Request, Response } from 'express';
import { CreateProductService } from '../../services/Product/CreateProductService';

class CreateProductController {
    async handle(req: Request, res: Response) {
        const { name, value, amount, category } = req.body
        let photo = ""

        if (req.file) {
            photo = req.file.filename
        }

        let club_id = req.club_id

        const createProductService = new CreateProductService

        const product = await createProductService.execute({
            name, category, value: value ? parseFloat(value) : 0, amount: amount ? parseFloat(amount) : 0, photo, club_id
        })

        if (product["photo"]) {
            product["photo_url"] = "https://pokercontroll.s3.sa-east-1.amazonaws.com/" + product["photo"];
        }

        return res.json(product)
    }
}

export { CreateProductController }