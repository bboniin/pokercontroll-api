import prismaClient from '../../prisma'

interface CashRequest {
    cash_id: string;
    club_id: string;
}

class EndCashService {
    async execute({ cash_id }: CashRequest) {

        const clientsCash = await prismaClient.client.findFirst({
            where: {
                chair: {
                    contains: "C"
                }
            },
        })

        if (clientsCash) {
            throw new Error("Remova todos clientes para finalizar sessão de cash")
        }

        const cash = await prismaClient.cash.update({
            where: {
                id: cash_id,
            },
            data: {
                closed: true,
                date_out: new Date()
            }
        })

        return (cash)
    }
}

export { EndCashService }