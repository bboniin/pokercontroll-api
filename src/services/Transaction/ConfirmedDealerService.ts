import prismaClient from '../../prisma'

interface TransactionRequest {
    id: string;
    valueCredit: number;
    valueReceive: number;
    valueDebit: number;
    date_payment: Date;
    club_id: string;
    observation: string;
    methods_transaction: Array<[]>;
}

class ConfirmedDealerService {
    async execute({ id,  club_id, valueCredit, valueDebit, valueReceive, date_payment, observation, methods_transaction}: TransactionRequest) {

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

        let client = {}

        if (transaction.client_id) {
            client = await prismaClient.client.findFirst({
                where: {
                    id: transaction.client_id,
                }
            })
        }

        const club = await prismaClient.club.findFirst({
            where: {
                id: club_id,
            }
        })

        let methodsPay = methods_transaction.filter((item)=> item["id"] != "Crédito" && item["id"] != "Pag Dívida" && item["id"] != "Saldo")
        
        let valuePaid = methodsPay.length ? methodsPay.map((method) => method["value"]).reduce((total, value) => total + value) : 0

        let valueMethods = methodsPay.length ? methodsPay.map((method) => method["value"]*((100-method["percentage"])/100)).reduce((total, value) => total + value) : 0
        
        if (!valueCredit) {
            date_payment = new Date()
        }
    
        await prismaClient.transaction.update({
            where: {
                id: id  
            },
            data: {
                date_payment: date_payment,
                observation: observation,
                paid: valueCredit ? false : true,
                value_paid: transaction.value_paid + valuePaid + valueReceive + valueDebit
            }
        })
    
        if (transaction.operation == "entrada") {
            if (transaction.client_id) {
                await prismaClient.client.update({
                    where: {
                        id: client["id"],
                    },
                    data: {
                        debt: client["debt"] - valuePaid
                    }
                })
            }

            await prismaClient.club.update({
                where: {
                    id: club_id,
                },
                data: {
                    dealer: club.dealer + valueMethods
                }
            })
        } else {
            let valueDebit = methods_transaction.filter((item) => item["id"] == "Pag Dívida" ).length != 0 ? methods_transaction.filter((item) => item["id"] == "Pag Dívida")[0]["value"] : 0
            
            if (transaction.client_id) {
                await prismaClient.client.update({
                    where: {
                        id: client["id"],
                    },
                    data: {
                        receive: client["receive"] - valuePaid
                    }
                })
            }

            await prismaClient.club.update({
                where: {
                    id: club_id,
                },
                data: {
                    dealer: club.dealer - valuePaid
                }
            })
        }
        
        methods_transaction.map(async (item) => {
            if (item["id"] != "Crédito" && item["value"]) {
                if (item["id"] != "Pag Dívida" && item["id"] != "Saldo") {
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

export { ConfirmedDealerService }