import { Request, Response } from 'express';
import { ListSuppliersService } from '../../services/Supplier/ListSuppliersService';

class ListSuppliersController {
    async handle(req: Request, res: Response) {

        let club_id = req.club_id

        const listSuppliersService = new ListSuppliersService

        const suppliers = await listSuppliersService.execute({
            club_id
        })

        return res.json(suppliers)
    }
}

export { ListSuppliersController }