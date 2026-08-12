"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ListDealerController = void 0;
var _ListDealerService = require("../../services/Transaction/ListDealerService");
class ListDealerController {
  async handle(req, res) {
    let {
      page
    } = req.query;
    let club_id = req.club_id;
    const listDealerService = new _ListDealerService.ListDealerService();
    const dealer = await listDealerService.execute({
      club_id,
      page: Number(page) > 0 ? Number(page) : 0
    });
    return res.json(dealer);
  }
}
exports.ListDealerController = ListDealerController;