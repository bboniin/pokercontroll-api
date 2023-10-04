import prismaClient from '../../prisma'

interface TournamentRequest {
    token: number;
    value: number;
    tournament: object;
}

class BuyTournamentService {
    async execute({ tournament, token, value }: TournamentRequest) {

        const tournamentC = await prismaClient.tournament.update({
            where: {
                id: tournament["id"],
            },
            data: {
                total_tokens: tournament['total_tokens']+token,
                totalAward_accumulated: tournament['totalAward_accumulated']+(value*0.05),
            },
            include: {
                clients_tournament: true,
            }
        })

        return tournamentC
    }
}

export { BuyTournamentService }