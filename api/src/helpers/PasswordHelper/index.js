const Bcrypt = require("bcrypt");
const { promisify } = require("util");

const SALT = parseInt(process.env.BCRYPT_SALT, 10);

class PasswordHelper {
  static generateHash(password) {
    return promisify(Bcrypt.hash)(password, SALT);
  }

  static compareHash(password, hash) {
    return promisify(Bcrypt.compare)(password, hash);
  }
}

module.exports = PasswordHelper;
