import { Request, Response } from 'express';
import { CreateTransactionService } from '../../services/Transaction/CreateTransactionService';
import { CreateOrderService } from '../../services/Order/CreateOrderService';
import { VerifyProductService } from '../../services/Product/VerifyProductService';
import { OrderTransactionService } from '../../services/Transaction/OrderTransactionService';
import { DiscoutProductService } from '../../services/Product/DiscoutProductService';
import { VerifyCreditTransactionService } from '../../services/Transaction/VerifyCreditTransactionService';
import { PaymentReceivesService } from '../../services/Transaction/PaymentReceivesService';

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

        let valueCredit = methods_transaction.filter((item) => item["id"] == "Crédito" ).length != 0 ? methods_transaction.filter((item) => item["id"] == "Crédito" )[0].value : 0

        if (valueCredit) {
            const verifyCreditTransactionService = new VerifyCreditTransactionService

            await verifyCreditTransactionService.execute({
                client_id, club_id, value: valueCredit
            })
        }

        let valueReceive = methods_transaction.filter((item) => item["id"] == "Saldo" ).length != 0 ? methods_transaction.filter((item) => item["id"] == "Saldo")[0].value : 0
        
        const paymentDebtsService = new PaymentReceivesService

        if (valueReceive) {
            await paymentDebtsService.execute({
                value: valueReceive, client_id, club_id
            })
        }
        
        const createTransactionService = new CreateTransactionService;

        const transaction = await createTransactionService.execute({
            paid: valueReceive == value ? true : valueCredit ? false : true, value, type: "clube", methods_transaction: methods_transaction, items_transaction: [{
                name: "bar",
                amount: 1,
                value: value
            }], client_id, sector_id: "", club_id, date_payment, observation, operation: "entrada"
        });

        const createOrderService = new CreateOrderService;

        const order = await createOrderService.execute({
            items: items, value, observation, club_id, client_id
        });

        const orderTransactionService = new OrderTransactionService;

        await orderTransactionService.execute({
            id: transaction['id'], club_id: club_id, sector_id: order['id']
        });

        const discoutProductService = new DiscoutProductService;

        await discoutProductService.execute({
            items
        });

        if (order["client"]["photo"]) {
            order["client"]["photo_url"] = "https://pokercontrol-data.s3.sa-east-1.amazonaws.com/" + order["client"]["photo"];
        };


        return res.json(order);
    }
}

export { CreateOrderController }