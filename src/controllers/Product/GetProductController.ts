import { Request, Response } from 'express';
import { GetProductService } from '../../services/Product/GetProductService';

class GetProductController {
    async handle(req: Request, res: Response) {

        const { product_id } = req.params

        let club_id = req.club_id

        const getProductService = new GetProductService

        const product = await getProductService.execute({
            id: product_id, club_id
        })

        if (product["photo"]) {
            product["photo_url"] = "https://pokercontrol-data.s3.sa-east-1.amazonaws.com/" + product["photo"];
        }

        return res.json(product)
    }
}

export { GetProductController }