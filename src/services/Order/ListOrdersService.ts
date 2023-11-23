import prismaClient from '../../prisma'

interface ProductRequest {
    club_id: string;
    page: number;
}

class ListOrdersService {
    async execute({ club_id, page }: ProductRequest) {
        
        const ordersTotal = await prismaClient.order.count({
            where: {
                club_id: club_id,
            }
        })

        const orders = await prismaClient.order.findMany({
            skip: page * 30,
            take: 30,
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

        return ({orders, ordersTotal})
    }
}

export { ListOrdersService }