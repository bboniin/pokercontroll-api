import prismaClient from '../../prisma'

interface InvoiceRequest {
    club_id: string;
}

class ListInvoicesService {
    async execute({ club_id }: InvoiceRequest) {

        const invoices = await prismaClient.invoice.findMany({
            where: {
                club_id: club_id,
            },
            orderBy: {
                create_at: "asc"
            }
        })

        return (invoices)
    }
}

export { ListInvoicesService }