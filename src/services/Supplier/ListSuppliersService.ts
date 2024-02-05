import prismaClient from '../../prisma'

interface SupplierRequest {
    club_id: string;
}

class ListSuppliersService {
    async execute({ club_id }: SupplierRequest) {

        const suppliers = await prismaClient.supplier.findMany({
            where: {
                club_id: club_id,
                active: true
            },
            orderBy: {
                create_at: "asc"
            }
        })

        return (suppliers)
    }
}

export { ListSuppliersService }