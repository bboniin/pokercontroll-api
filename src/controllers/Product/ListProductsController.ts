import { Request, Response } from 'express';
import { ListProductsService } from '../../services/Product/ListProductsService';

class ListProductsController {
    async handle(req: Request, res: Response) {

        let club_id = req.club_id

        const listProductsService = new ListProductsService

        const products = await listProductsService.execute({
            club_id
        })

        products.map((item) => {
            if (item["photo"]) {
                item["photo_url"] = "https://pokercontroll.s3.sa-east-1.amazonaws.com/" + item["photo"];
            }
        })

        return res.json(products)
    }
}

export { ListProductsController }