import { Request, Response } from 'express';
import { ListInvoicesService } from '../../services/Invoice/ListInvoicesService';

class ListInvoicesController {
    async handle(req: Request, res: Response) {

        let club_id = req.club_id

        const listInvoicesService = new ListInvoicesService

        const invoices = await listInvoicesService.execute({
            club_id
        })

        return res.json(invoices)
    }
}

export { ListInvoicesController }