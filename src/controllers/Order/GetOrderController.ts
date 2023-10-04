import { Request, Response } from 'express';
import { GetOrderService } from '../../services/Order/GetOrderService';

class GetOrderController {
    async handle(req: Request, res: Response) {

        const { order_id } = req.params

        let club_id = req.club_id

        const getOrderService = new GetOrderService

        const order = await getOrderService.execute({
            club_id, order_id
        })

        if (order["client"]["photo"]) {
            order["client"]["photo_url"] = "https://pokercontroll.s3.sa-east-1.amazonaws.com/" + order["client"]["photo"];
        }

        return res.json(order)
    }
}

export { GetOrderController }