import prismaClient from '../../prisma'

interface TransactionRequest {
    purchases: Array<[]>;
    tournament_id: string;
    client_id: string;
}


class VerifyBuyTournamentService {
    async execute({ client_id, purchases, tournament_id }: TransactionRequest) {
        
        const tournament = await prismaClient.tournament.findUnique({
            where: {
                id: tournament_id
            },
            include: {
                purchases: true,
                clients_purchases: {
                    where: {
                        client_id: client_id
                    }
                },
                clients: {
                    where: {
                        client_id: client_id
                    }
                }
            }
        })
        
        if (!tournament.clients.length) {
            throw new Error("Jogador não participa desse torneio")
        }

        purchases.map((item)=>{
            if(item["type"] == "purchase"){
                if (tournament.is_rebuy) {
                    const totalRebuy = tournament.purchases.filter((data)=> data.type == "purchase").reduce((accumulator, data) => accumulator + data.max_limit*item["amount"], 0);
                    if (totalRebuy > tournament.max_rebuy) {
                        throw new Error("Número máximo de rebuys atingido")
                    }
                } else {
                    const exists = tournament.clients_purchases.some(data => item["purchase_id"] === data.id)   
                    if(exists) {
                        throw new Error(item["name"] +" já foi adquirido por esse jogador")
                    }   
                }
            }else{
                const exists = tournament.clients_purchases.some(data => item["purchase_id"] === data.id)   
                if(exists) {
                    throw new Error(item["name"] +" já foi adquirido por esse jogador")
                }     
            }
        })
    
        return tournament
    }
}

export { VerifyBuyTournamentService }