import prismaClient from '../../prisma'

interface TransactionRequest {
    id: string;
    valueCredit: number;
    date_payment: Date;
    club_id: string;
    methods_transaction: Array<[]>;
}

class ConfirmedTransactionService {
    async execute({ id,  club_id, valueCredit, date_payment, methods_transaction}: TransactionRequest) {

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

        let methodsPay = methods_transaction.filter((item)=> item["id"] != "Crédito" && item["id"] != "Pag Dívida")

        let valuePaid = 0
        let valueMethods = methodsPay.length ? methodsPay.map((method) => method["value"]*((100-method["percentage"])/100)).reduce((total, value) => total + value) : 0
        if (valueCredit) {
            valuePaid = transaction.value-valueCredit
        } else {
            date_payment = new Date()

            valuePaid = transaction.value_paid + methodsPay.length ? methodsPay.map((method) => method["value"]).reduce((total, value) => total + value) : 0
        }
    
        await prismaClient.transaction.update({
            where: {
                id: id  
            },
            data: {
                paid: valueCredit ? false : true,
                value_paid: valuePaid
            }
        })
    
        if (transaction.operation == "entrada") {
            if (client) {
                await prismaClient.client.update({
                    where: {
                        id: client.id,
                    },
                    data: {
                        debt: client.debt - (valuePaid - transaction.value_paid)
                    }
                })
            }
            
            await prismaClient.club.update({
                where: {
                    id: club_id,
                },
                data: {
                    balance: club.balance + valueMethods
                }
            })
        } else {
            if (client) {
                await prismaClient.client.update({
                    where: {
                        id: client.id,
                    },
                    data: {
                        receive: client.receive - (valuePaid - transaction.value_paid)
                    }
                })
            }
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
            if (item["id"] != "Crédito") {
                if (item["id"] != "Pag Dívida") {
                    const method = await prismaClient.method.findFirst({
                        where: {
                            id: item["id"]
                        },
                    })
                    let balance = transaction.operation == "entrada" ? method["balance"]+item["value"]*((100-item["percentage"])/100) : method["balance"]-item["value"]*((100-item["percentage"])/100)
                    await prismaClient.method.update({
                        where: {
                            id: item["id"],
                        },
                        data: {
                            balance: balance
                        }
                    })
                }
                await prismaClient.methodsTransaction.create({
                    data: {
                        name: item["name"],
                        percentage: item["percentage"],
                        value: item["value"],
                        transaction_id: transaction.id
                    }
                })
            }
        })

        return ("Pagamento confirmado com sucesso")
     }
}

export { ConfirmedTransactionService }