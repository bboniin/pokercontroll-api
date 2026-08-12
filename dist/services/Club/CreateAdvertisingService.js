"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CreateAdvertisingService = void 0;
var _prisma = _interopRequireDefault(require("../../prisma"));
var _S3Storage = _interopRequireDefault(require("../../utils/S3Storage"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class CreateAdvertisingService {
  async execute({
    file,
    club_id
  }) {
    if (!club_id || !file) {
      throw new Error("Arquivo e clube são obrigatórios");
    }
    const club = await _prisma.default.club.findUnique({
      where: {
        id: club_id
      },
      include: {
        advertisings: true
      }
    });
    if (!club) {
      throw new Error("Clube não encontrado");
    }
    const s3Storage = new _S3Storage.default();
    const upload = await s3Storage.saveFile(file);
    const advertising = await _prisma.default.advertising.create({
      data: {
        order: club.advertisings.length,
        club_id: club_id,
        file: upload,
        repetitions: 1
      }
    });
    return advertising;
  }
}
exports.CreateAdvertisingService = CreateAdvertisingService;