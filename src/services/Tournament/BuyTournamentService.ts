import prismaClient from '../../prisma'

interface TournamentRequest {
    token: number;
    value: number;
    addOn: number;
    buyin: number;
    rebuy: number;
    passport: number;
    jackpot: number;
    dealer: number;
    rebuyDuplo: number;
    super_addOn: number;
    transaction_id: string;
    tournament: object;
    client_id: string;
}

class BuyTournamentService {
    async execute({ tournament, transaction_id, passport, super_addOn, dealer, jackpot, client_id, token, value, rebuy, rebuyDuplo, addOn, buyin }: TournamentRequest) {
        
        const clientTournamentGet = await prismaClient.clientTournament.findFirst({
            where: {
                client_id: client_id,
                tournament_id: tournament["id"],
            },
        })

        const client = await prismaClient.clientTournament.update({
            where: {
                id: clientTournamentGet["id"],
            },
            data: {
                passport: clientTournamentGet['passport'] || passport ? true : false,
                jackpot: clientTournamentGet['jackpot'] || jackpot ? true : false,
                dealer: clientTournamentGet['dealer'] || dealer ? true : false,
                rebuy: clientTournamentGet['rebuy']+rebuy,
                rebuyDuplo: clientTournamentGet['rebuyDuplo']+rebuyDuplo,
                buyin: clientTournamentGet['buyin']+buyin,
                addOn: clientTournamentGet['addOn']+addOn,
                super_addOn: clientTournamentGet['super_addOn']+super_addOn,
            }
        })

        let max = 0

        if (client.passport && client.jackpot && client.dealer && client.buyin && client.addOn && client.super_addOn) {
            
            if (tournament["is_rebuy"]) {
                    if (client.rebuy + (client.rebuyDuplo*2) >= tournament["max_rebuy"]) {
                        max = 1
                }
            } else {
                    if(client.rebuy && client.rebuyDuplo) {
                        max = 1
                }
            }
        }

        await prismaClient.transactionTournament.create({
            data: {
                rebuy: rebuy,
                addOn: rebuy,
                rebuyDuplo: rebuy,
                super_addOn: super_addOn,
                buyin: rebuy,
                transaction_id: transaction_id,
                tournament_id: tournament["id"]
            }
        })

        const tournamentC = await prismaClient.tournament.update({
            where: {
                id: tournament["id"],
            },
            data: {
                total_tokens: tournament['total_tokens']+token,
                totalAward_accumulated:  tournament['totalAward_accumulated']+value,
                rebuy: tournament['rebuy']+rebuy,
                rebuyDuplo: tournament['rebuyDuplo']+rebuyDuplo,
                buyin: tournament['buyin']+buyin,
                addOn: tournament['addOn']+addOn,
                super_addOn: tournament['super_addOn'] + super_addOn,
                max_count: tournament['super_addOn'] + max,
            },
            include: {
                clients_tournament: true,
            }
        })
        

        return tournamentC
    }
}

export { BuyTournamentService }