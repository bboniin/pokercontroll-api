import { Request, Response } from 'express';
import { CreateInvoiceService } from '../../services/Invoice/CreateInvoiceService';
import { CreateTransactionClubeService } from '../../services/Transaction/CreateTransactionClubeService';

class CreateInvoiceController {
    async handle(req: Request, res: Response) {
        const { supplier_id, products, methods_transaction, identifier, observation, paid } = req.body

        let club_id = req.club_id

        const createInvoiceService = new CreateInvoiceService

        const invoice = await createInvoiceService.execute({
           products, supplier_id, club_id, identifier, observation
        })

        const createTransactionClubeService = new CreateTransactionClubeService

        await createTransactionClubeService.execute({
            paid, value: invoice.value, type: "clube", methods_transaction, items_transaction: {
                name: `Estoque`,
                amount: invoice.amount,
                value: invoice.value
            }, club_id, date_payment: new Date(), observation: "", operation: "saida"
        })

        return res.json(invoice)
    }
}

export { CreateInvoiceController }