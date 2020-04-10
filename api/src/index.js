const ContextStrategy = require("./db/strategies/base/context/strategy");
const MongoDB = require("./db/strategies/mongodb");
const HeroSchema = require("./db/strategies/mongodb/schemas/heroSchema");

const HeroRoute = require('./routes/heroRoutes');

function mapRoutes(instance, methods) {
  return methods.map(method => instance[method]());
}

const Hapi = require("hapi");
const app = new Hapi.Server({
  port: 3000,
});

async function main() {
  const connection = MongoDB.connect();
  const contextMongo = new ContextStrategy(new MongoDB(connection, HeroSchema));

  app.route([
    ...mapRoutes(new HeroRoute(contextMongo), HeroRoute.methods())
  ]);

  await app.start();
  console.log("servidor rodando!");

  return app;
};

module.exports = main();
