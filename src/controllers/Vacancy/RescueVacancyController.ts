import { Request, Response } from "express";
import { RescueVacancyService } from "../../services/Vacancy/RescueVacancyService";

class RescueVacancyController {
  async handle(req: Request, res: Response) {
    const { vacancy_id } = req.params;
    const { client_id } = req.body;

    let club_id = req.club_id;
    let user_id = req.user_id;

    const rescueVacancyService = new RescueVacancyService();

    const supplier = await rescueVacancyService.execute({
      client_id,
      club_id,
      vacancy_id,
      user_id,
    });

    return res.json(supplier);
  }
}

export { RescueVacancyController };
