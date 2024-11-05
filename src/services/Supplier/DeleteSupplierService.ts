import prismaClient from '../../prisma'

interface SupplierRequest {
    supplier_id: string;
    club_id: string;
}

class DeleteSupplierService {
    async execute({ supplier_id, club_id }: SupplierRequest) {

        const supplier = await prismaClient.supplier.update({
            where: {
                id: supplier_id,
            }, 
            data: {
                active: false
            }
        })
        return (supplier)
    }
}

export { DeleteSupplierService }