import prismaClient from '../../prisma'

interface TransactionRequest {
    club_id: string;
    id: string;
    observation: string;
}

class EditTransactionService {
    async execute({id, club_id, observation}: TransactionRequest) {

        if (!id) {
            throw new Error("Id da transação é obrigatório")
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
        
        const transaction = await prismaClient.transaction.update({
            where: {
              id: id  
            },
            data: {
                observation: observation
            }
        })

        return (transaction)
     }
}

export { EditTransactionService }