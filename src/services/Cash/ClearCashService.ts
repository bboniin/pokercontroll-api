import prismaClient from '../../prisma'

interface CashRequest {
    club_id: string;
}

class ClearCashService {
    async execute({ club_id }: CashRequest) {

        const clients = await prismaClient.client.updateMany({
            where: {
                club_id: club_id,
                chair: {
                    contains: "C"
                }
            },
            data: {
                chair: ""
            }
        })

        return (clients)
    }
}

export { ClearCashService }