import prismaClient from '../../prisma'

interface TransactionRequest {
    paid: boolean;
    type: string;
    value: number;
    method: string;
    client_id: string;
    club_id: string;
    operation: string;
    observation: string;
    date_payment: Date;
}

const types = {
    "jackpot": true,
}

const methods = {
    "dinheiro": true,
    "pix": true,
    "credito": true,
    "debito": true,
    "clube": true
}

class CreateJackpotService {
    async execute({ type, value, club_id, paid, client_id, method, operation, date_payment, observation }: TransactionRequest) {
        
        const client = await prismaClient.client.findFirst({
            where: {
                id: client_id,
                club_id: club_id
            }
        })
        
        const club = await prismaClient.club.findUnique({
            where: {
                id: club_id
            }
        })

        if (!client) {
            throw new Error("Cliente não encontrado")
        }

        if (!type || !value || !client_id || !operation) {
            throw new Error("Tipo, valor, operação e id do cliente é obrigatório")
        }

        if (operation != "entrada" && operation != "saida") {
            throw new Error("Apenas entradas e saidas são aceitos")
        }

        if (!types[type]) {
            throw new Error("Tipo de transação é inválido")
        }

        if (paid && !methods[method]) {
            throw new Error("Método de pagamento é inválido")
        }

        if (paid) {
            date_payment = new Date()
        } else {
            method = ""
        }

        if (operation == "entrada") {
            if (!paid) {
                if (((client.balance - value) * -1) > client.credit ) {
                    throw new Error("Crédito insuficiente para essa transação")
                } else {
                    const transaction = await prismaClient.transaction.create({
                        data: {
                            type: type,
                            value: value,
                            client_id: client_id,
                            method: method,
                            club_id: club_id,
                            operation: operation,
                            date_payment: date_payment,
                            observation: observation,
                            paid: paid
                        }
                    })

                    await prismaClient.client.update({
                        where: {
                            id: client_id,
                        },
                        data: {
                            balance: client.balance - value
                        }
                    })
                    return transaction
                }
            } else {
                const transaction = await prismaClient.transaction.create({
                    data: {
                        type: type,
                        value: value,
                        client_id: client_id,
                        method: method,
                        club_id: club_id,
                        operation: operation,
                        date_payment: date_payment,
                        observation: observation,
                        paid: paid
                    }
                })

                await prismaClient.club.update({
                    where: {
                        id: club_id,
                    },
                    data: {
                        jackpot: club.jackpot + value
                    }
                })
            return transaction
            }
        } else {
            const transaction = await prismaClient.transaction.create({
                data: {
                    type: type,
                    value: value,
                    client_id: client_id,
                    method: method,
                    club_id: club_id,
                    operation: operation,
                    date_payment: date_payment,
                    observation: observation,
                    paid: paid
                }
            })
            if (paid) {
                    await prismaClient.club.update({
                        where: {
                            id: club_id,
                        },
                        data: {
                            jackpot: club.jackpot - value
                        }
                    })
                }
            return transaction
        }
        
        

    }
}

export { CreateJackpotService }