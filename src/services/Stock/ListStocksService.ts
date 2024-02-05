import prismaClient from '../../prisma'

interface StockRequest {
    club_id: string;
}

class ListStocksService {
    async execute({ club_id }: StockRequest) {

        const stocks = await prismaClient.stock.findMany({
            where: {
                club_id: club_id,
            },
            orderBy: {
                create_at: "asc"
            }
        })

        return (stocks)
    }
}

export { ListStocksService }