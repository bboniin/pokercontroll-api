import prismaClient from '../../prisma'

interface CashRequest {
    club_id: string;
}

class ClearCashService {
    async execute({ club_id }: CashRequest) {

        const clients = await prismaClient.client.updateMany({
            where: {
                club_id: club_id,
                chair_cash: {
                    contains: "C"
                }
            },
            data: {
                chair_cash: ""
            }
        })

        return (clients)
    }
}

export { ClearCashService }