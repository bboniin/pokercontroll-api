import { Request, Response } from 'express';
import { DeleteSupplierService } from '../../services/Supplier/DeleteSupplierService';

class DeleteSupplierController {
    async handle(req: Request, res: Response) {

        const { supplier_id } = req.params

        let club_id = req.club_id

        const deleteSupplierService = new DeleteSupplierService

        const supplier = await deleteSupplierService.execute({
            club_id, supplier_id
        })

        return res.json(supplier)
    }
}

export { DeleteSupplierController }