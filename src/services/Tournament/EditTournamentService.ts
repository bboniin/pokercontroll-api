import prismaClient from '../../prisma'
import S3Storage from '../../utils/S3Storage';

interface TournamentRequest {
    name: string;
    photo: string;
    value: number;
    club_id: string;
    amount: number;
    tournament_id: string;
}

class EditTournamentService {
    async execute({ name, club_id, value, photo, amount, tournament_id }: TournamentRequest) {

        if (!tournament_id || !value || !name || !amount || !club_id) {
            throw new Error("Preencha os campos obrigatórios")
        }

        const tournament = await prismaClient.tournament.findFirst({
            where: {
                id: tournament_id,
                club_id: club_id,
            }
        })

        if (!tournament) {
            throw new Error("Produto não encontrado")
        }

        let data = {
            name: name,
            value: value,
            amount: amount,
        }

        if (photo) {
            const s3Storage = new S3Storage()

            const upload = await s3Storage.saveFile(photo)

            data["photo"] = upload
        }

        const tournamentEdit = await prismaClient.tournament.update({
            where: {
                id: tournament_id,
            },
            data: data,
            include: {
                clients_tournament: true,
            }
        })

        return (tournamentEdit)
    }
}

export { EditTournamentService }