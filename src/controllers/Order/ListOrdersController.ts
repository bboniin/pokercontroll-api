import { Request, Response } from 'express';
import { ListOrdersService } from '../../services/Order/ListOrdersService';

class ListOrdersController {
    async handle(req: Request, res: Response) {

        let { page } = req.query
        let club_id = req.club_id

        const listOrdersService = new ListOrdersService

        const {orders, ordersTotal} = await listOrdersService.execute({
            club_id, page: Number(page) > 0 ? Number(page) : 0
        })

        orders.map((order) => {
            if (order["client"]["photo"]) {
                order["client"]["photo_url"] = "https://pokercontroll.s3.sa-east-1.amazonaws.com/" + order["client"]["photo"];
            }
        })

        return res.json({orders, ordersTotal})
    }
}

export { ListOrdersController }