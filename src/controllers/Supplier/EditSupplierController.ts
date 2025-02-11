import { Request, Response } from 'express';
import { EditSupplierService } from '../../services/Supplier/EditSupplierService';

class EditSupplierController {
    async handle(req: Request, res: Response) {
        const { supplier_id } = req.params
        const { name } = req.body

        let club_id = req.club_id

        const editSupplierService = new EditSupplierService

        const supplier = await editSupplierService.execute({
            name, club_id, supplier_id
        })

        return res.json(supplier)
    }
}

export { EditSupplierController }