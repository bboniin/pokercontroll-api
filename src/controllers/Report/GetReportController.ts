import { Request, Response } from 'express';
import { CashReportService } from '../../services/Report/CashReportService';

class GetReportController {
    async handle(req: Request, res: Response) {

        const { sector, type, method, date_initial, date_end } = req.body

        let club_id = req.club_id

        let sectors = {
            "cash": true,
            // "torneio": true,
            "bar": true,
            "dealer": true,
            "jackpot": true,
            "passport": true,
            "financeiro": true
        }

        if (sectors[sector]) {
            if (sector == "cash") {
                const cashReportService = new CashReportService

                const report = await cashReportService.execute({
                    club_id, type, method, date_initial, date_end
                })
                
                return res.json(report)
            }
            
        } else {
            throw new Error("Setor selecionado não existe")
        }
    }
}

export { GetReportController }