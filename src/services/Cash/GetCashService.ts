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

        return (cash)
    }
}

export { GetCashService }