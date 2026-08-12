"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TransferClubeController = void 0;
var _TransferClubeService = require("../../services/Transaction/TransferClubeService");
class TransferClubeController {
  async handle(req, res) {
    const {
      value,
      type,
      name,
      typeOut,
      observation,
      methods_transaction
    } = req.body;
    let club_id = req.club_id;
    let user_id = req.user_id;
    const transferClubeService = new _TransferClubeService.TransferClubeService();
    const transaction = await transferClubeService.execute({
      type,
      value,
      typeOut,
      club_id,
      observation,
      methods_transaction,
      user_id
    });
    return res.json(transaction);
  }
}
exports.TransferClubeController = TransferClubeController;