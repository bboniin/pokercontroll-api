"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _awsSdk = _interopRequireDefault(require("aws-sdk"));
var _fs = _interopRequireDefault(require("fs"));
var _path = _interopRequireDefault(require("path"));
var _mime = _interopRequireDefault(require("mime"));
var _multer = _interopRequireDefault(require("../config/multer"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class S3Storage {
  constructor() {
    this.client = void 0;
    this.client = new _awsSdk.default.S3({
      region: "sa-east-1"
    });
  }
  async saveFile(filename) {
    const originalPath = _path.default.resolve(_multer.default.directory, filename);
    const ContentType = _mime.default.getType(originalPath);
    if (!ContentType) {
      if (_fs.default.existsSync(originalPath)) {
        await _fs.default.promises.unlink(originalPath);
      }
      throw new Error("Tipo de arquivo não reconhecido ou arquivo não encontrado");
    }
    try {
      const fileContent = await _fs.default.promises.readFile(originalPath);
      await this.client.putObject({
        Bucket: "pokercontrol-data",
        Key: filename,
        ACL: "public-read",
        Body: fileContent,
        ContentType
      }).promise();
      return filename;
    } finally {
      try {
        await _fs.default.promises.unlink(originalPath);
      } catch (err) {
        console.error(`Erro ao deletar arquivo local ${filename}:`, err);
      }
    }
  }
  async deleteFile(file) {
    await this.client.deleteObject({
      Bucket: "pokercontrol-data",
      Key: file
    }).promise();
  }
}
var _default = exports.default = S3Storage;