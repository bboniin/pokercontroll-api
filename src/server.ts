import express, { Request, Response, NextFunction } from "express";
import 'express-async-errors'
import cors from 'cors'
import cron from "node-cron";

import { router } from "./routes";

const app = express()

app.use(express.json())

app.use(cors())

app.use(router)

app.use(function (req, res, next) {
    req.connection.setNoDelay(true)
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Origin", "https://pokercontroll.com.br");
    res.header('Access-Control-Expose-Headers', 'agreementrequired');
    next()
})

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof Error) {
        return res.status(400).json({ message: err.message })
    }
    return res.status(500).json({
        status: 'error',
        message: 'Internal serve error'
    })
})


app.listen(3333, () => console.log("rodando v11"))