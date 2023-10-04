import prismaClient from '../../prisma'

interface TransactionRequest {
    method: string;
    club_id: string;
    id: string;
    observation: string;
}

class EditTransactionService {
    async execute({id, method, club_id, observation}: TransactionRequest) {

        if (!id || !method) {
            throw new Error("Id da transação e método de pagamento são obrigatórios")
        }


        const getTransaction = await prismaClient.transaction.findFirst({
            where: {
                id: id,
                club_id: club_id,
            }
        })
        
        if (!getTransaction) {
            throw new Error("Essa cobrança não existe")
        }
        
        let data = {
            method: method,
        }

        if (observation) {
            data["observation"] = observation
        }
        
        const transaction = await prismaClient.transaction.update({
            where: {
              id: id  
            },
            data: data
        })

        return (transaction)
     }
}

export { EditTransactionService }