import prismaClient from '../../prisma'

interface MethodRequest {
    name: string;
    club_id: string;
    percentage: number;
    type: string;
    identifier: string;
}

class CreateMethodService {
    async execute({ name, club_id, percentage, type, identifier }: MethodRequest) {

        if (!name || !club_id || !type) {
            throw new Error("Preencha os campos obrigatórios")
        }

        const method = await prismaClient.method.create({
            data: {
                percentage: percentage,
                name: name,
                identifier: identifier,
                type: type,
                club_id: club_id
            }
        })

        return (method)
    }
}

export { CreateMethodService }