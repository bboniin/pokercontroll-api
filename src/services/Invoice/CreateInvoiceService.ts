import prismaClient from '../../prisma'

interface InvoiceRequest {
    products: Array<[]>;
    club_id: string;
    supplier_id: string;
    identifier: string;
    observation: string;
}

class CreateInvoiceService {
    async execute({ products, club_id, identifier, observation,  supplier_id }: InvoiceRequest) {

        if (!club_id || !supplier_id || !identifier || products.length == 0) {
            throw new Error("Preencha os campos obrigatórios")
        }

        let whereProdutcs = {
            OR: []
        }

        let value_total = 0
        let amount_total = 0

        products.map((item, index) => {

            item["amount"] = item["amount"] ? parseInt(item["amount"]) : 0
            item["cost_value"] = item["cost_value"] ? parseFloat(item["cost_value"]) : 0

            value_total += item["amount"] * item["cost_value"]
            amount_total += item["amount"]
        
            if (!item["amount"] || !item["product_id"]) {
                throw new Error(`Preencha os campos obrigatórios do produto ${index+1}`)
            }

            whereProdutcs.OR.push({
                id: item["product_id"],
                club_id: club_id
            })
        })
        
        const productsWhere = await prismaClient.product.findMany({
            where: whereProdutcs
        })

        if (products.length != productsWhere.length) {
            throw new Error("Algum dos produtos não foi encontrado")
        }

        const invoice = await prismaClient.invoice.create({
            data: {
                value: value_total,
                amount: amount_total,
                club_id: club_id, 
                identifier: identifier,
                observation: observation,
                supplier_id: supplier_id
            }
        })

        products.map(async (item) => {
            let [productWhere] = productsWhere.filter((data)=> data.id == item["product_id"])
            await prismaClient.product.update({
                where: {
                    id: item["product_id"],
                },
                data: {
                    amount: productWhere.amount + item["amount"]
                }
            })
            await prismaClient.stock.create({
                data: {
                    name: productWhere.name,
                    amount: item["amount"],
                    club_id: club_id, 
                    cost_value: item["cost_value"],
                    invoice_id: invoice.id
                }
            })
        })
        
        
        

        return (invoice)
    }
}

export { CreateInvoiceService }