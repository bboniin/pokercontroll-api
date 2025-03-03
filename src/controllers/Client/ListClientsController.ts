import { Request, Response } from "express";
import { ListClientsService } from "../../services/Client/ListClientsService";

class ListClientsController {
  async handle(req: Request, res: Response) {
    let { page, all, search } = req.query;
    let club_id = req.club_id;

    const listClientsService = new ListClientsService();

    const { clients, clientsTotal } = await listClientsService.execute({
      club_id,
      page: Number(page) > 0 ? Number(page) : 0,
      all: all == "true" ? true : false,
      search: search ? String(search) : "",
    });

    clients.map((item) => {
      if (item["photo"]) {
        item["photo_url"] =
          "https://pokercontrol-data.s3.sa-east-1.amazonaws.com/" +
          item["photo"];
      }
    });

    return res.json({ clients, clientsTotal });
  }
}

export { ListClientsController };
