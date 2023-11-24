import { Request, Response } from 'express';
import { CashReportService } from '../../services/Report/CashReportService';
import { FinanceiroReportService } from '../../services/Report/FinanceiroReportService';
import { BarReportService } from '../../services/Report/BarReportService';
import { TournamentReportService } from '../../services/Report/TournamentReportService';

class GetReportController {
    async handle(req: Request, res: Response) {

        const { sector, sector_id, type, method, date_initial, date_end } = req.body

        let club_id = req.club_id

        let sectors = {
            "cash": true,
            "torneio": true,
            "bar": true,
            "financeiro": true
        }

        if (sectors[sector]) {
            if (sector == "cash") {
                const cashReportService = new CashReportService

                const report = await cashReportService.execute({
                    club_id, type, method, sector_id
                })
                
                return res.json(report)
            }
            
            if (sector == "torneio") {
                const tournamentReportService = new TournamentReportService

                const report = await tournamentReportService.execute({
                    club_id, type, method, sector_id
                })
                
                return res.json(report)
            }

            if (sector == "bar") {
                const barReportService = new BarReportService

                const report = await barReportService.execute({
                    club_id, type, method, date_initial, date_end
                })
                
                return res.json(report)
            }

            if (sector == "financeiro") {
                const financeiroReportService = new FinanceiroReportService

                const report = await financeiroReportService.execute({
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