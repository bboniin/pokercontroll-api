import prismaClient from '../../prisma'

interface SupplierRequest {
    name: string;
    club_id: string;
    supplier_id: string;
}

class EditSupplierService {
    async execute({ name, club_id, supplier_id }: SupplierRequest) {

        if (!supplier_id || !name || !club_id) {
            throw new Error("Preencha os campos obrigatórios")
        }

        const supplier = await prismaClient.supplier.findFirst({
            where: {
                id: supplier_id,
                club_id: club_id,
            }
        })

        if (!supplier) {
            throw new Error("Fornecedor não encontrado")
        }

        const supplierEdit = await prismaClient.supplier.update({
            where: {
                id: supplier_id,
            },
            data: {
                name: name
            },
        })

        return (supplierEdit)
    }
}

export { EditSupplierService }