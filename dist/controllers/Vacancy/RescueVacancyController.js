"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RescueVacancyController = void 0;
var _RescueVacancyService = require("../../services/Vacancy/RescueVacancyService");
class RescueVacancyController {
  async handle(req, res) {
    const {
      vacancy_id
    } = req.params;
    const {
      client_id
    } = req.body;
    let club_id = req.club_id;
    let user_id = req.user_id;
    const rescueVacancyService = new _RescueVacancyService.RescueVacancyService();
    const supplier = await rescueVacancyService.execute({
      client_id,
      club_id,
      vacancy_id,
      user_id
    });
    return res.json(supplier);
  }
}
exports.RescueVacancyController = RescueVacancyController;