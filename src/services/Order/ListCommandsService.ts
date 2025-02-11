import prismaClient from '../../prisma'

interface ProductRequest {
    club_id: string;
    page: number;
}

class ListCommandsService {
    async execute({ club_id, page }: ProductRequest) {
        
        const commandsTotal = await prismaClient.command.count({
            where: {
                club_id: club_id,
            }
        })

        const commands = await prismaClient.command.findMany({
            skip: page * 30,
            take: 30,
            where: {
                club_id: club_id,
            },
            orderBy: {
                create_at: "desc"
            },
            include: {
                client: true,
                orders: true,
                products_order: true
            }
        })

        commands.sort(function(a,b) {
            return a.open ? -1 : 1;
        });

        return ({commands, commandsTotal})
    }
}

export { ListCommandsService }