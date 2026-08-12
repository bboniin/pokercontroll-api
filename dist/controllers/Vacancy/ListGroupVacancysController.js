"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ListGroupVacancyController = void 0;
var _ListGroupVacancysService = require("../../services/Vacancy/ListGroupVacancysService");
class ListGroupVacancyController {
  async handle(req, res) {
    let club_id = req.club_id;
    const listGroupVacancysService = new _ListGroupVacancysService.ListGroupVacancysService();
    const vacancys = await listGroupVacancysService.execute({
      club_id
    });
    return res.json(vacancys);
  }
}
exports.ListGroupVacancyController = ListGroupVacancyController;