import prismaClient from '../../prisma'

interface TransactionRequest {
    id: string;
    club_id: string;
    methods_transaction: Array<[]>;
}

class ConfirmedTransactionService {
    async execute({ id,  club_id, methods_transaction}: TransactionRequest) {

        if (!club_id || !id || methods_transaction.length == 0) {
            throw new Error("id da cobrança, método de pagamento e do clube é obrigatório")
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

        let valueMethods = transaction.value
        
        if (transaction.value == methods_transaction.map((method) => method["value"]).reduce((total, value) => total + value)) {
            valueMethods = methods_transaction.map((method) => method["value"]*((100-method["percentage"])/100)).reduce((total, value) => total + value)
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
                    balance: club.balance + valueMethods
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
                    balance: club.balance - valueMethods
                }
            })
        }

        methods_transaction.map(async (item) => {
            await prismaClient.methodsTransaction.create({
                data: {
                    name: item["name"],
                    percentage: item["percentage"],
                    value: item["value"],
                    transaction_id: transaction.id
                }
            })
        })

        return ("Pagamento confirmado com sucesso")
     }
}

export { ConfirmedTransactionService }