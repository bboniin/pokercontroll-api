import prismaClient from '../../prisma'

interface ProductRequest {
    club_id: string;
}

class ListOrdersService {
    async execute({ club_id }: ProductRequest) {

        const orders = await prismaClient.order.findMany({
            where: {
                club_id: club_id,
            },
            orderBy: {
                create_at: "asc"
            },
            include: {
                client: true,
            }
        })

        return (orders)
    }
}

export { ListOrdersService }