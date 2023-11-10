import prismaClient from '../../prisma'

interface MethodRequest {
    method_id: string;
    club_id: string;
}

class DeleteMethodService {
    async execute({ method_id, club_id }: MethodRequest) {

        const method = await prismaClient.method.delete({
            where: {
                id: method_id,
            }
        })
        return (method)
    }
}

export { DeleteMethodService }