"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GetReportController = void 0;
var _CashReportService = require("../../services/Report/CashReportService");
var _FinanceiroReportService = require("../../services/Report/FinanceiroReportService");
var _BarReportService = require("../../services/Report/BarReportService");
var _TournamentReportService = require("../../services/Report/TournamentReportService");
class GetReportController {
  async handle(req, res) {
    const {
      sector,
      sector_id,
      type,
      method,
      date_initial,
      date_end
    } = req.body;
    let club_id = req.club_id;
    let sectors = {
      "cash": true,
      "torneio": true,
      "bar": true,
      "financeiro": true
    };
    if (sectors[sector]) {
      if (sector == "cash") {
        const cashReportService = new _CashReportService.CashReportService();
        const report = await cashReportService.execute({
          club_id,
          type,
          method,
          sector_id
        });
        return res.json(report);
      }
      if (sector == "torneio") {
        const tournamentReportService = new _TournamentReportService.TournamentReportService();
        const report = await tournamentReportService.execute({
          club_id,
          type,
          method,
          sector_id
        });
        return res.json(report);
      }
      if (sector == "bar") {
        const barReportService = new _BarReportService.BarReportService();
        const report = await barReportService.execute({
          club_id,
          type,
          method,
          date_initial,
          date_end
        });
        return res.json(report);
      }
      if (sector == "financeiro") {
        const financeiroReportService = new _FinanceiroReportService.FinanceiroReportService();
        const report = await financeiroReportService.execute({
          club_id,
          type,
          method,
          date_initial,
          date_end
        });
        return res.json(report);
      }
    } else {
      throw new Error("Setor selecionado não existe");
    }
  }
}
exports.GetReportController = GetReportController;