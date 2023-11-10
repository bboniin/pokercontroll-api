import prismaClient from '../../prisma'

interface MethodRequest {
    name: string;
    club_id: string;
    percentage: number;
    method_id: string;
    type: string;
    identifier: string;
}

class EditMethodService {
    async execute({ name, club_id, percentage, type, identifier, method_id }: MethodRequest) {

        if (!method_id || !name || !club_id || !type) {
            throw new Error("Preencha os campos obrigatórios")
        }

        const method = await prismaClient.method.findFirst({
            where: {
                id: method_id,
                club_id: club_id,
            }
        })

        if (!method) {
            throw new Error("Método de pagamento não encontrado")
        }


        const methodEdit = await prismaClient.method.update({
            where: {
                id: method_id,
            },
            data: {
                percentage: percentage,
                type: type,
                identifier: identifier,
                name: name
            },
        })

        return (methodEdit)
    }
}

export { EditMethodService }