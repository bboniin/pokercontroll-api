import prismaClient from '../../prisma'

interface CommandRequest {
    command_id: string;
    club_id: string;
}

class GetCommandService {
    async execute({ command_id, club_id }: CommandRequest) {

        const command = await prismaClient.command.findFirst({
            where: {
                id: command_id,
                club_id: club_id,
            },
            orderBy: {
                create_at: "asc"
            },
            include: {
                client: true,
                products_order: true
            }
        })

        return (command)
    }
}

export { GetCommandService }