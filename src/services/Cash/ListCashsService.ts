import prismaClient from '../../prisma'

interface CashRequest {
    club_id: string;
    page: number;
    all: boolean;
}

class ListCashsService {
    async execute({ club_id, page, all }: CashRequest) {

        let filter = {}

        if (!all) {
            filter = {
                skip: page * 30,
                take: 30,
            }
        }

        const cashsTotal = await prismaClient.cash.count({
            where: {
                club_id: club_id,
            },
        })

        const cashs = await prismaClient.cash.findMany({
            ...filter,
            where: {
                club_id: club_id,
            },
            orderBy: {
                create_at: "desc",
            }
        })

        return {cashs, cashsTotal}
    }
}

export { ListCashsService }