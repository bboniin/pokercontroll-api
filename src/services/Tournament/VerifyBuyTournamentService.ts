import prismaClient from '../../prisma'

interface TransactionRequest {
    passport: number;
    jackpot: number;
    addOn: number;
    buyin: number;
    rebuy: number;
    rebuyDuplo: number;
    tournament: object;
    client_id: string;
}


class VerifyBuyTournamentService {
    async execute({ client_id, passport, jackpot, addOn, buyin, rebuy, rebuyDuplo, tournament }: TransactionRequest) {
        
        const client = await prismaClient.clientTournament.findFirst({
            where: {
                client_id: client_id,
                tournament_id: tournament["id"]
            }
        })
        
        if (!client) {
            throw new Error("Jogador não participa desse torneio")
        }

        if (passport) {
            if(client.passport) {
                throw new Error("Passport já foi adquirido por esse jogador")
            }
        }
        
        if (jackpot){
            if(client.jackpot) {
            throw new Error("Jackpot já foi adquirido por esse jogador")
        }}

        if (addOn){
            if(client.addOn) {
            throw new Error("ADD ON já foi adquirido por esse jogador")
        }}
        if (buyin){
            if(client.buyin) {
            throw new Error("Buyin já foi adquirido por esse jogador")
        }}

        if (rebuy || rebuyDuplo) {
            if ((rebuy + (rebuyDuplo*2) + client.rebuy + (client.rebuyDuplo*2)) > tournament["max_rebuy"]) {
                throw new Error("Número máximo de rebuys atingido")
            } 
        }
    }
}

export { VerifyBuyTournamentService }