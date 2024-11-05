import prismaClient from '../../prisma'

interface MethodRequest {
    name: string;
    club_id: string;
    percentage: number;
    identifier: string;
}

class CreateMethodService {
    async execute({ name, club_id, percentage, identifier }: MethodRequest) {

        if (!name || !club_id) {
            throw new Error("Preencha os campos obrigatórios")
        }

        const method = await prismaClient.method.create({
            data: {
                percentage: percentage,
                name: name,
                identifier: identifier,
                club_id: club_id,
                balance: 0
            }
        })

        return (method)
    }
}

export { CreateMethodService }