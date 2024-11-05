import prismaClient from '../../prisma'

interface CashRequest {
    name: string;
    club_id: string;
}

class CreateCashService {
    async execute({ club_id, name }: CashRequest) {

        const cashGet = await prismaClient.cash.findFirst({
            where: {
                club_id: club_id,
                closed: false
            }
        })

        if (cashGet) {
            throw new Error("Já existe sessão cash iniciada")
        }

        const cash = await prismaClient.cash.create({
            data: {
                name: name,
                club_id: club_id,
                closed: false,
                date_in: new Date()
            }
        })

        return cash
    }
}

export { CreateCashService }