import { Request, Response } from "express";
import { GetClubDashboardService } from "../../services/Club/GetClubDashboardService";

class GetClubDashboardController {
  async handle(req: Request, res: Response) {
    const club_id = req.club_id;

    const getClubDashboardService = new GetClubDashboardService();

    try {
      const dashboardData = await getClubDashboardService.execute({
        club_id,
      });

      return res.json(dashboardData);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }
}

export { GetClubDashboardController };
