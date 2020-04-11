const Joi = require("@hapi/joi");
const Boom = require("@hapi/boom");
const BaseRoute = require("../base/baseRoute");

const headers = Joi.object({
  authorization: Joi.string().description(
    "Mandatory value, but in the documentation it is automatically added to the headers if a token has been added to the authorization part of the documentation (Authorize button located at the beginning of the documentation)"
  ),
}).unknown();

class HeroRoutes extends BaseRoute {
  constructor(db) {
    super();
    this.db = db;
  }

  list() {
    const query = Joi.object({
      limit: Joi.number()
        .integer()
        .default(10)
        .description("Amount to limit results"),
      skip: Joi.number()
        .integer()
        .default(0)
        .description("Amount to skip for pagination"),
      name: Joi.string().min(3).max(100).description("Name of hero"),
      power: Joi.string().min(3).max(25).description("Power of hero"),
    });

    return {
      path: "/heroes",
      method: "GET",
      options: {
        tags: ["api", "heroes"],
        description: "Should list heroes",
        notes: "Results can be paged and filtered by name and/or power",
        validate: {
          failAction: (request, headers, erro) => {
            throw erro;
          },
          query,
          headers,
        },
      },
      handler: (request) => {
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
          return Boom.internal(error.message, error);
        }
      },
    };
  }

  create() {
    const payload = Joi.object({
      name: Joi.string().min(3).max(100).required().description("Name of hero"),
      power: Joi.string()
        .min(3)
        .max(25)
        .required()
        .description("Power of hero"),
    });

    return {
      path: "/heroes",
      method: "POST",
      options: {
        tags: ["api", "heroes"],
        description: "Should register heroes",
        notes: "Should register hero by name and power",
        validate: {
          failAction: (request, headers, erro) => {
            throw erro;
          },
          payload,
          headers,
        },
      },
      handler: (request) => {
        try {
          const data = request.payload;

          return this.db.store(data);
        } catch (error) {
          console.log("deu ruim mano", error.message);
          return Boom.internal(error.message, error);
        }
      },
    };
  }

  update() {
    const payload = Joi.object({
      name: Joi.string().min(3).max(100).description("Name of hero"),
      power: Joi.string().min(3).max(25).description("Power of hero"),
    });

    const params = Joi.object({
      id: Joi.string().required().description("The hero ID to be updated"),
    });

    return {
      path: "/heroes/{id}",
      method: "PATCH",
      options: {
        tags: ["api", "heroes"],
        description: "Should update hero by id",
        notes: "Should update any field of hero by id",
        validate: {
          failAction: (request, headers, erro) => {
            throw erro;
          },
          params,
          payload,
          headers,
        },
      },
      handler: async (request) => {
        try {
          const { payload } = request;
          const { id } = request.params;

          const data = JSON.parse(JSON.stringify(payload));

          const result = await this.db.update(id, data);
          if (!result) {
            return Boom.preconditionFailed("Hero id not exist");
          }
          return result;
        } catch (error) {
          console.log("deu ruim mano", error.message);
          return Boom.internal(error.message, error);
        }
      },
    };
  }

  delete() {
    const params = Joi.object({
      id: Joi.string().required().description("The hero ID to be deleted"),
    });

    return {
      path: "/heroes/{id}",
      method: "DELETE",
      options: {
        tags: ["api", "heroes"],
        description: "Should remove hero by id",
        notes: "Should remove hero by id",
        validate: {
          failAction: (request, headers, erro) => {
            throw erro;
          },
          params,
          headers,
        },
      },
      handler: async (request) => {
        try {
          const { id } = request.params;

          const result = await this.db.delete(id);

          if (!result) {
            return Boom.preconditionFailed("Hero id not exist");
          }

          return result;
        } catch (error) {
          console.log("deu ruim mano", error.message);
          return Boom.internal(error.message, error);
        }
      },
    };
  }
}

module.exports = HeroRoutes;
