"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ListVacancyController = void 0;
var _ListVacancysService = require("../../services/Vacancy/ListVacancysService");
class ListVacancyController {
  async handle(req, res) {
    let {
      page,
      name
    } = req.query;
    let club_id = req.club_id;
    const listVacancysService = new _ListVacancysService.ListVacancysService();
    const {
      vacancys,
      vacancysTotal
    } = await listVacancysService.execute({
      club_id,
      page: Number(page) > 0 ? Number(page) : 0,
      name: name ? String(name) : ""
    });
    return res.json({
      vacancys,
      vacancysTotal
    });
  }
}
exports.ListVacancyController = ListVacancyController;