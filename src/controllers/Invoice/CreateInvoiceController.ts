import { Request, Response } from 'express';
import { CreateInvoiceService } from '../../services/Invoice/CreateInvoiceService';
import { CreateTransactionClubeService } from '../../services/Transaction/CreateTransactionClubeService';

class CreateInvoiceController {
    async handle(req: Request, res: Response) {
        const { supplier_id, products, methods_transaction, identifier, observation, datePayment } = req.body

        let club_id = req.club_id

        const createInvoiceService = new CreateInvoiceService

        const invoice = await createInvoiceService.execute({
           products, supplier_id, club_id, identifier, observation
        })

        const createTransactionClubeService = new CreateTransactionClubeService

        let valueCredit = methods_transaction.filter((item) => item["id"] == "Crédito").length != 0 ? methods_transaction.filter((item) => item["id"] == "Crédito")[0].value : 0
        
        await createTransactionClubeService.execute({
            paid: valueCredit ? false : true, value: invoice.value, type: "clube", methods_transaction,
            items_transaction: {
                name: `Estoque`,
                amount: invoice.amount,
                value: invoice.value
            }, club_id, date_payment: datePayment,
            observation: observation, operation: "saida", valueReceive: 0, valueDebit: 0
        })

        return res.json(invoice)
    }
}

export { CreateInvoiceController }