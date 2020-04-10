const Joi = require("joi");
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
      config: {
        validate: {
          failAction: (request, headers, erro) => {
            throw erro;
          },
          query: {
            limit: Joi.number().integer().default(10),
            skip: Joi.number().integer().default(0),
            name: Joi.string().min(3).max(100),
            power: Joi.string().min(3).max(25),
          },
        },
      },
      handler: (request, headers) => {
        try {
          const { name, power, skip, limit } = request.query;
          const filter = {};
          name &&
            Object.assign(filter, {
              name: { $regex: `.*${name}*.`, $options: "gi" },
            });
          power &&
            Object.assign(filter, {
              power: { $regex: `.*${power}*.`, $options: "gi" },
            });

          return this.db.index(filter, skip, limit);
        } catch (error) {
          console.log("deu ruim mano", error.message);
          return headers.response(error).code(500);
        }
      },
    };
  }

  create() {
    return {
      path: "/heroes",
      method: "POST",
      config: {
        validate: {
          failAction: (request, headers, erro) => {
            throw erro;
          },
          payload: {
            name: Joi.string().min(3).max(100).required(),
            power: Joi.string().min(3).max(25).required(),
            birthDate: Joi.string(),
          },
        },
      },
      handler: (request, headers) => {
        try {
          const data = request.payload;

          return this.db.store(data);
        } catch (error) {
          console.log("deu ruim mano", error.message);
          return headers.response(error).code(500);
        }
      },
    };
  }

  update() {
    return {
      path: "/heroes/{id}",
      method: "PUT",
      config: {
        validate: {
          failAction: (request, headers, erro) => {
            throw erro;
          },
          payload: {
            name: Joi.string().min(3).max(100),
            power: Joi.string().min(3).max(25),
            birthDate: Joi.string(),
          },
        },
      },
      handler: (request, headers) => {
        try {
          const data = request.payload;
          const { id } = request.params;

          return this.db.update(id, data);
        } catch (error) {
          console.log("deu ruim mano", error.message);
          return headers.response(error).code(500);
        }
      },
    };
  }

  delete() {
    return {
      path: "/heroes/{id}",
      method: "DELETE",
      handler: (request, headers) => {
        try {
          const { id } = request.params;

          return this.db.delete({ _id: id });
        } catch (error) {
          console.log("deu ruim mano", error.message);
          return headers.response(error).code(500);
        }
      },
    };
  }
}

module.exports = HeroRoutes;
