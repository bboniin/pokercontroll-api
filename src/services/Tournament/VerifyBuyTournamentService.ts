import prismaClient from '../../prisma'

interface TransactionRequest {
    passport: number;
    jackpot: number;
    addOn: number;
    buyin: number;
    rebuy: number;
    rebuyDuplo: number;
    rebuyTriplo: number;
    dealer: number;
    super_addOn: number;
    tournament: object;
    client_id: string;
}


class VerifyBuyTournamentService {
    async execute({ client_id, passport, rebuyTriplo, dealer, super_addOn, jackpot, addOn, buyin, rebuy, rebuyDuplo, tournament }: TransactionRequest) {
        
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

        if (dealer) {
            if(client.dealer) {
                throw new Error("Dealer já foi adquirido por esse jogador")
            }
        }
        
        if (super_addOn) {
            if(client.super_addOn) {
                throw new Error("Super ADD ON já foi adquirido por esse jogador")
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

        if (tournament["is_rebuy"]) {
            if (rebuy || rebuyDuplo || rebuyTriplo) {
                if ((rebuy + (rebuyDuplo*2) + (rebuyTriplo*3) + client.rebuy + (client.rebuyDuplo*2) + (client.rebuyTriplo*3)) > tournament["max_rebuy"]) {
                    throw new Error("Número máximo de rebuys atingido")
                } 
            }
        } else {
            if (rebuy){
                if(client.rebuy) {
                throw new Error("Reentrada já foi adquirido por esse jogador")
            }}
            if (rebuyDuplo){
                if(client.rebuyDuplo) {
                throw new Error("Reentrada Dupla já foi adquirido por esse jogador")
            }}
            if (rebuyTriplo){
                if(client.rebuyTriplo) {
                throw new Error("Reentrada Tripla já foi adquirido por esse jogador")
            }}
        }

       
    }
}

export { VerifyBuyTournamentService }