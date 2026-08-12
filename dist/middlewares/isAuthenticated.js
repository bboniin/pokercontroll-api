"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isAuthenticated = isAuthenticated;
var _jsonwebtoken = require("jsonwebtoken");
var _auth = _interopRequireDefault(require("./../utils/auth"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function isAuthenticated(req, res, next) {
  const authToken = req.headers.authorization;
  if (!authToken) {
    return res.status(401).json({
      message: 'Token não enviado'
    });
  }
  const [, token] = authToken.split(' ');
  try {
    const data = (0, _jsonwebtoken.verify)(token, _auth.default.jwt.secret);
    req.user_id = data.sub;
    req.club_id = data["club_id"];
    req.user_type = data["user_type"];
    return next();
  } catch (error) {
    return res.status(401).json({
      message: 'Internal server Error'
    });
  }
  return next();
}