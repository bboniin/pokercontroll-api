"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DeleteAdvertisingService = void 0;
var _prisma = _interopRequireDefault(require("../../prisma"));
var _S3Storage = _interopRequireDefault(require("../../utils/S3Storage"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class DeleteAdvertisingService {
  async execute({
    advertising_id,
    club_id
  }) {
    const advertisingGet = await _prisma.default.advertising.findFirst({
      where: {
        id: advertising_id,
        club_id
      }
    });
    if (!advertisingGet) {
      throw new Error("Anuncio não encontrado");
    }
    const advertising = await _prisma.default.advertising.delete({
      where: {
        id: advertising_id
      }
    });
    if (advertising.file) {
      const s3Storage = new _S3Storage.default();
      await s3Storage.deleteFile(advertising.file);
    }
    return advertising;
  }
}
exports.DeleteAdvertisingService = DeleteAdvertisingService;