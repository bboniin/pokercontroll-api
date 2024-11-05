import prismaClient from '../../prisma'

interface CommandRequest {
    club_id: string;
    command_id: string;
}

class ClosedCommandService {
    async execute({ club_id, command_id }: CommandRequest) {

        if (!command_id || !club_id) {
            throw new Error("Preencha os campos obrigatórios")
        }

        const command = await prismaClient.command.findFirst({
            where: {
                id: command_id,
                club_id: club_id,
            }
        })

        if (!command) {
            throw new Error("Fornecedor não encontrado")
        }

        const commandEdit = await prismaClient.command.update({
            where: {
                id: command_id,
            },
            data: {
                open: false
            },
        })

        return (commandEdit)
    }
}

export { ClosedCommandService }