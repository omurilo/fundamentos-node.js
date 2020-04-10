const Hapi = require("@hapi/hapi");
const Inert = require("@hapi/inert");
const Vision = require("@hapi/vision");
const HapiJwt = require("hapi-auth-jwt2");
const HapiSwagger = require("hapi-swagger");

const ContextStrategy = require("./db/strategies/base/context/strategy");
const MongoDB = require("./db/strategies/mongodb");
const HeroSchema = require("./db/strategies/mongodb/schemas/heroSchema");

const PostgreSQL = require("./db/strategies/postgres");
const UserSchema = require("./db/strategies/postgres/schemas/userSchema");

const JWT_SECRET = "minha_senha_secreta_256_bits";

const HeroRoute = require("./routes/heroRoutes");
const AuthRoute = require("./routes/authRoutes");

function mapRoutes(instance, methods) {
  return methods.map((method) => instance[method]());
}

const app = new Hapi.Server({
  port: 3000,
});

async function main() {
  const connectionMongo = MongoDB.connect();
  const contextMongo = new ContextStrategy(
    new MongoDB(connectionMongo, HeroSchema)
  );

  const connectionPostgres = await PostgreSQL.connect();
  const model = await PostgreSQL.defineModel(connectionPostgres, UserSchema);
  const contextPostgres = new ContextStrategy(
    new PostgreSQL(connectionPostgres, model)
  );

  const swaggerOptions = {
    info: {
      title: "Heroes API - #CursoNodeBR",
      version: "v1.0",
      contact: {
        name: "Murilo Henrique",
        url: "https://omurilo.dev",
        email: "hi@omurilo.dev",
      },
    },
    documentationPath: "/docs",
    sortEndpoints: "ordered",
    schemes: ["http", "https"],
    security: [
      {
        jwt: [],
      },
    ],
    securityDefinitions: {
      jwt: {
        type: "apiKey",
        name: "authorization",
        in: "header",
      },
    },
  };

  await app.register([
    Inert,
    HapiJwt,
    Vision,
    {
      plugin: HapiSwagger,
      options: swaggerOptions,
    },
  ]);

  app.auth.strategy("jwt", "jwt", {
    key: JWT_SECRET,
    validate: async (data, request) => {
      const [user] = await contextPostgres.index({
        username: data.username.toLowerCase(),
        id: data.id,
      });

      if (!user) {
        return {
          isValid: false,
        };
      }

      return {
        isValid: true,
      };
    },
  });

  app.auth.default("jwt");

  app.route([
    ...mapRoutes(new HeroRoute(contextMongo), HeroRoute.methods()),
    ...mapRoutes(new AuthRoute(contextMongo, JWT_SECRET), AuthRoute.methods()),
  ]);

  await app.start();
  console.log("servidor rodando!");

  return app;
}

module.exports = main();
