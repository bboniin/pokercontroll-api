import { Request, Response } from 'express';
import { CreateTransactionService } from '../../services/Transaction/CreateTransactionService';
import { CreateOrderService } from '../../services/Order/CreateOrderService';
import { VerifyProductService } from '../../services/Product/VerifyProductService';
import { OrderTransactionService } from '../../services/Transaction/OrderTransactionService';
import { DiscoutProductService } from '../../services/Product/DiscoutProductService';

class CreateOrderController {
    async handle(req: Request, res: Response) {
        const { paid, items, methods_transaction, client_id, date_payment, observation } = req.body

        let club_id = req.club_id;

        const verifyProductService = new VerifyProductService;

        await verifyProductService.execute({
            items
        });

        let value = 0

        items.map((item) => {
            value += item.total * item.value
        });
        
        const createTransactionService = new CreateTransactionService;

        const transaction = await createTransactionService.execute({
            paid, value, type: "clube", methods_transaction, items_transaction: [{
                name: "bar",
                amount: 1,
                value: value
            }], client_id, club_id, date_payment, observation, operation: "entrada"
        });

        const createOrderService = new CreateOrderService;

        const order = await createOrderService.execute({
            items: items, value, observation, club_id, client_id
        });

        const orderTransactionService = new OrderTransactionService;

        await orderTransactionService.execute({
            id: transaction['id'], club_id: club_id, order_id: order['id']
        });

        const discoutProductService = new DiscoutProductService;

        await discoutProductService.execute({
            items
        });

        if (order["client"]["photo"]) {
            order["client"]["photo_url"] = "https://pokercontroll.s3.sa-east-1.amazonaws.com/" + order["client"]["photo"];
        };


        return res.json(order);
    }
}

export { CreateOrderController }