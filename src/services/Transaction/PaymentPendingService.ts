import prismaClient from '../../prisma'
import { getMethodsPay } from '../../utils/functions';

interface TransactionRequest {
    club_id: string;
    client_id: string;
    date_payment: Date;
    observation: string;
    methods_transaction: Array<[]>;
    valueReceive: number;
}

class PaymentPendingService {
    async execute({ club_id, client_id, observation, date_payment, valueReceive, methods_transaction}: TransactionRequest) {

        if (!club_id || !client_id || methods_transaction.length == 0) {
            throw new Error("id cliente, clube e método de pagamento são obrigatórios")
        }

        const client = await prismaClient.client.findFirst({
            where: {
                id: client_id,
                club_id: club_id,
            },
            include: {
                club: true,
                transactions: {
                    where: {
                        paid: false,
                        operation: "entrada"
                    },
                    orderBy: {
                        create_at: "asc"
                    },
                    include: {
                        methods_transaction: true,
                        items_transaction: true,
                    }
                }
            }
        })

        if (!client) {
            throw new Error("Cliente não encontrada")
        }

        if (client.transactions.length == 0) {
            throw new Error("Nenhuma transação encontrada")
        }

        let methodsPay = methods_transaction.filter((item)=> item["id"] != "Crédito" && item["id"] != "Pag Dívida" && item["id"] != "Saldo")
        
        let valuePaid = methodsPay.length ? methodsPay.map((method) => method["value"]).reduce((total, value) => total + value) : 0

        await prismaClient.client.update({
            where: {
                id: client.id,
            },
            data: {
                debt: client.debt - (valuePaid + valueReceive),
                receive: client.receive - valueReceive,
            }
        })

        let totalPaidClub = 0
        let totalPaidDealer = 0
        let totalPaidPassport = 0
        let totalPaidJackpot = 0

        let methods_transactionC = methods_transaction.filter((item) => item["id"] != "Crédito") 

        await Promise.all(client.transactions.map(async (item) => {
            let { payCredit, methodsPay, methodsC } = await getMethodsPay((item.value-item.value_paid), methods_transactionC)
            
            if (methodsPay.length) {
                await prismaClient.transaction.update({
                    where: {
                        id: item.id  
                    },
                    data: {
                        date_payment: date_payment || new Date(),
                        observation: observation,
                        paid: payCredit ? false : true,
                        value_paid: payCredit ? item.value-payCredit : item.value
                    }
                })
                
                let methodsPayTransaction = methodsPay.filter((item)=> item["id"] != "Crédito" && item["id"] != "Pag Dívida" && item["id"] != "Saldo")
                
                let valueMethods = methodsPayTransaction.length ? methodsPayTransaction.map((method) => method["value"] * ((100 - method["percentage"]) / 100)).reduce((total, value) => total + value) : 0
                
                switch (item.type) {
                    case "clube": {
                        totalPaidClub += valueMethods;
                        break;
                    }
                    case "dealer": {
                        totalPaidDealer += valueMethods;
                        break;
                    }
                    case "jackpot": {
                        totalPaidJackpot += valueMethods;
                        break;
                    }
                    case "passport": {
                        totalPaidPassport += valueMethods;
                        break;
                    }
                }

                Promise.all(methodsPay.map(async (data) => {
                    if (data["id"] != "Crédito" && data["value"]) {
                        if (data["id"] != "Pag Dívida" && data["id"] != "Saldo") {
                            const method = await prismaClient.method.findFirst({
                                where: {
                                    id: data["id"]
                                },
                            })
                            let balance = item.operation == "entrada" ? method["balance"]+data["value"]*((100-data["percentage"])/100) : method["balance"]-data["value"]*((100-data["percentage"])/100)
                            await prismaClient.method.update({
                                where: {
                                    id: data["id"],
                                },
                                data: {
                                    balance: balance
                                }
                            })
                        } else {
                            if (item.type != "clube") {
                                totalPaidClub -= data["value"];
                                switch (item.type) {
                                    case "dealer": {
                                        totalPaidDealer += data["value"];
                                        break;
                                    }
                                    case "jackpot": {
                                        totalPaidJackpot += data["value"];
                                        break;
                                    }
                                    case "passport": {
                                        totalPaidPassport += data["value"];
                                        break;
                                    }
                                }
                            }
                        }
                        await prismaClient.methodsTransaction.create({
                            data: {
                                name: data["name"],
                                percentage: data["percentage"],
                                value: data["value"],
                                transaction_id: item.id
                            }
                        })
                    }
                })
                )
            }
            
            methods_transactionC = methodsC
        }))

        if (totalPaidClub || totalPaidDealer || totalPaidPassport || totalPaidJackpot) {
            await prismaClient.club.update({
                where: {
                    id: club_id,
                },
                data: {
                    balance: client.club.balance + totalPaidClub,
                    dealer: client.club.dealer + totalPaidDealer,
                    passport: client.club.passport + totalPaidPassport,
                    jackpot: client.club.jackpot + totalPaidJackpot
                }
            })
        }

        return ("Pagamentos realizados com sucesso")
     }
}

export { PaymentPendingService }