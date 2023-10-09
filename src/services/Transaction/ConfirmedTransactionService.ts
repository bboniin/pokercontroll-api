import prismaClient from '../../prisma'

interface TransactionRequest {
    id: string;
    club_id: string;
    method: string;
}

const methods = {
    "dinheiro": true,
    "pix": true,
    "credito": true,
    "debito": true,
    "clube": true,
}

class ConfirmedTransactionService {
    async execute({ id,  club_id, method}: TransactionRequest) {

        if (!club_id || !id || !method) {
            throw new Error("Id da cobrança e do clube é obrigatório")
        }

        const transaction = await prismaClient.transaction.findFirst({
            where: {
                id: id,
            }
        })
        
        if (!transaction) {
            throw new Error("Transaação não encontrada")
        }

        const client = await prismaClient.client.findFirst({
            where: {
                id: transaction.client_id,
            }
        })

        const club = await prismaClient.club.findFirst({
            where: {
                id: club_id,
            }
        })

        if (!methods[method]) {
            throw new Error("Método de pagamento é inválido")
        }
    
        await prismaClient.transaction.update({
            where: {
                id: id  
            },
            data: {
                paid: true,
            }
        })
    
        if (transaction.operation == "entrada") {
            await prismaClient.client.update({
                where: {
                    id: client.id,
                },
                data: {
                    balance: client.balance + transaction.value
                }
            })
            await prismaClient.club.update({
                where: {
                    id: club_id,
                },
                data: {
                    balance: club.balance + transaction.value
                }
            })
        } else {
            await prismaClient.client.update({
                where: {
                    id: client.id,
                },
                data: {
                    balance: client.balance - transaction.value
                }
            })
            await prismaClient.club.update({
                where: {
                    id: club_id,
                },
                data: {
                    balance: club.balance - transaction.value
                }
            })
        }

        return ("Pagamento confirmado com sucesso")
     }
}

export { ConfirmedTransactionService }