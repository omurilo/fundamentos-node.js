const Joi = require("@hapi/joi");
const Boom = require("@hapi/boom");
const Jwt = require("@commercial/jwt");
const BaseRoute = require("../base/baseRoute");
const PasswordHelper = require("../../helpers/PasswordHelper");

const Context = require("../../db/strategies/base/context/strategy");
const PostgreSQL = require("../../db/strategies/postgres");
const UserSchema = require("../../db/strategies/postgres/schemas/userSchema");

class AuthRoute extends BaseRoute {
  constructor(db, secret) {
    super();
    this.db = db;
    this.secret = secret;
  }

  auth() {
    const schema = Joi.object({
      username: Joi.string().min(3).required().description('Username on Database'),
      password: Joi.string().min(3).required().description('Password on Datebase'),
    });

    return {
      path: "/auth",
      method: "POST",
      options: {
        tags: ["api", "auth"],
        description: "Get token",
        notes: "SignIn with username and password",
        auth: false,
        validate: {
          failAction: (request, headers, erro) => {
            throw erro;
          },
          payload: schema,
        },
      },
      handler: async (request) => {
        const { username, password } = request.payload;

        const connection = await PostgreSQL.connect();
        const model = await PostgreSQL.defineModel(connection, UserSchema);
        const context = new Context(new PostgreSQL(connection, model));

        const [result] = await context.index({ username: username.toLowerCase() });

        if (!result) {
          return Boom.unauthorized("User not found");
        }

        const match = await PasswordHelper.compareHash(
          password,
          result.password
        );

        if (!match) {
          return Boom.unauthorized("User or password is invalid");
        }

        const token = Jwt.token.generate(
          {
            username,
            id: result.id,
          },
          this.secret,
          {}
        );

        return {
          token,
        };
      },
    };
  }
}

module.exports = AuthRoute;
