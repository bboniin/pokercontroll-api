import prismaClient from '../../prisma'

interface CashRequest {
    club_id: string;
}

class GetCashService {
    async execute({ club_id }: CashRequest) {

        const cash = await prismaClient.cash.findFirst({
            where: {
                club_id: club_id,
                closed: false
            }
        })

        if (cash) {
            const transactions = await prismaClient.transaction.findMany({
                where: {
                    sector_id: cash.id
                }
            })

            cash["transactions"] = transactions
        }
        
        return (cash)
    }
}

export { GetCashService }