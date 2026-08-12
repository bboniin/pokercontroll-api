"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SendVacancyController = void 0;
var _SendVacancyService = require("../../services/Vacancy/SendVacancyService");
class SendVacancyController {
  async handle(req, res) {
    const {
      vacancy_id
    } = req.params;
    const {
      client_id
    } = req.body;
    let club_id = req.club_id;
    const sendVacancyService = new _SendVacancyService.SendVacancyService();
    const supplier = await sendVacancyService.execute({
      client_id,
      club_id,
      vacancy_id
    });
    return res.json(supplier);
  }
}
exports.SendVacancyController = SendVacancyController;