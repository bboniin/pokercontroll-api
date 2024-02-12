import prismaClient from '../../prisma'
import { compare } from "bcryptjs"
import { sign } from 'jsonwebtoken'
import authConfig from "./../../utils/auth"

interface AuthRequest {
    email: string;
    password: string;
}

class AuthUserService {
    async execute({ email, password }: AuthRequest) {

        const user = await prismaClient.user.findFirst({
            where: {
                email: email
            },
            include: {
                club: {
                    select: {
                        access_cash: true,
                        access_order: true,
                        access_report: true,
                        access_stock: true,
                        access_tournament: true,
                        access_users: true
                    }
                }
            }
        })

        if (!user) {
            throw new Error("Email e Senha não correspondem ou não existe")
        }

        const passwordMatch = await compare(password, user.password)

        const token = sign({
            club_id: user.club_id,
            user_type: user.type,
        }, authConfig.jwt.secret, {
            subject: user.id,
            expiresIn: '365d'
        })

        if (!passwordMatch) {
            throw new Error("Email e Senha não correspondem ou não existe")
        }

        let photo_url = user.photo ? "https://pokercontrol-data.s3.sa-east-1.amazonaws.com/" + user.photo : ""

        return ({
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                club_id: user.club_id,
                type: user.type,
                club: user.club,
                photo_url: photo_url
            },
            token
        })

    }
}

export { AuthUserService }