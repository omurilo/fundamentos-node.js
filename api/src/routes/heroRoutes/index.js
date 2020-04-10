const BaseRoute = require("../base/baseRoute");

class HeroRoutes extends BaseRoute {
  constructor(db) {
    super();
    this.db = db;
  }

  list() {
    return {
      path: "/heroes",
      method: "GET",
      handler: (request, headers) => {
        try {
          const { name, power, skip, limit } = request.query;
          const filter = {};
          name && Object.assign(filter, { name });
          power && Object.assign(filter, { power });
          if ((isNaN(skip) && skip) || (isNaN(limit) && limit)) {
            throw Error('O tipo dos parâmetros informados está incorreto');
          }
          return this.db.index(filter, parseInt(skip, 10), parseInt(limit, 10));
        } catch (error) {
          console.log("deu ruim mano", error.message);
          return headers.response(error).code(500);
        }
      },
    };
  }

  create() {
    return {
      path: "/hero",
      method: "POST",
      handler: (request, headers) => {
        const data = request.payload;

        return this.db.store(data);
      },
    };
  }
}

module.exports = HeroRoutes;
