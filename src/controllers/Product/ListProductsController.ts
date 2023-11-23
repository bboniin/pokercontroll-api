import { Request, Response } from 'express';
import { ListProductsService } from '../../services/Product/ListProductsService';

class ListProductsController {
    async handle(req: Request, res: Response) {

        let { page, all } = req.query
        let club_id = req.club_id

        const listProductsService = new ListProductsService

        const {products, productsTotal} = await listProductsService.execute({
            club_id, page: Number(page) > 0 ? Number(page) : 0, all: all == "true" ? true : false
        })

        products.map((item) => {
            if (item["photo"]) {
                item["photo_url"] = "https://pokercontroll.s3.sa-east-1.amazonaws.com/" + item["photo"];
            }
        })

        return res.json({products, productsTotal})
    }
}

export { ListProductsController }