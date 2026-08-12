"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = IsEmail;
function IsEmail(field) {
  const regx = /^[a-z0-9.]+@[a-z0-9]+\.[a-z]+(\.[a-z]+)?$/i;
  return regx.test(field);
}