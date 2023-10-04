import prismaClient from '../../prisma'

interface ProductRequest {
    order_id: string;
    club_id: string;
}

class GetOrderService {
    async execute({ order_id, club_id }: ProductRequest) {

        const order = await prismaClient.order.findFirst({
            where: {
                id: order_id,
                club_id: club_id,
            },
            orderBy: {
                create_at: "asc"
            },
            include: {
                client: true,
                products_order: true
            }
        })

        return (order)
    }
}

export { GetOrderService }