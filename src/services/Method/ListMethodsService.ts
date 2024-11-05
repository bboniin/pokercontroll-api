import prismaClient from '../../prisma'

interface MethodRequest {
    club_id: string;
    page: number;
    all: boolean;
}

class ListMethodsService {
    async execute({ club_id, page, all }: MethodRequest) {

        let filter = {}

        if (!all) {
            filter = {
                skip: page * 30,
                take: 30,
            }
        }

        const methodsTotal = await prismaClient.method.count({
            where: {
                club_id: club_id,
            }
        })

        const methods = await prismaClient.method.findMany({
            ...filter,
            where: {
                club_id: club_id,
            },
            orderBy: {
                create_at: "asc"
            }
        })

        return all ? methods : ({methods, methodsTotal})
    }
}

export { ListMethodsService }