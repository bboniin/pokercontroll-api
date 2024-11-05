import { Request, Response } from 'express';
import { CreateSupplierService } from '../../services/Supplier/CreateSupplierService';

class CreateSupplierController {
    async handle(req: Request, res: Response) {
        const { name } = req.body

        let club_id = req.club_id

        const createSupplierService = new CreateSupplierService

        const supplier = await createSupplierService.execute({
            name, club_id
        })
        return res.json(supplier)
    }
}

export { CreateSupplierController }