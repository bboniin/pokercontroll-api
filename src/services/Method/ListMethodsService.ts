import prismaClient from '../../prisma'

interface MethodRequest {
    club_id: string;
}

class ListMethodsService {
    async execute({ club_id }: MethodRequest) {

        const methods = await prismaClient.method.findMany({
            where: {
                club_id: club_id,
            },
            orderBy: {
                create_at: "asc"
            }
        })

        return (methods)
    }
}

export { ListMethodsService }