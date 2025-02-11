import prismaClient from '../../prisma'

interface SupplierRequest {
    name: string;
    club_id: string;
}

class CreateSupplierService {
    async execute({ name, club_id }: SupplierRequest) {

        if (!name || !club_id) {
            throw new Error("Preencha os campos obrigatórios")
        }

        const supplier = await prismaClient.supplier.create({
            data: {
                name: name,
                club_id: club_id
            }
        })

        return (supplier)
    }
}

export { CreateSupplierService }