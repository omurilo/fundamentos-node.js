const Joi = require("@hapi/joi");
const Boom = require("@hapi/boom");
const BaseRoute = require("../base/baseRoute");

class HeroRoutes extends BaseRoute {
  constructor(db) {
    super();
    this.db = db;
  }

  list() {
    const schema = Joi.object({
      limit: Joi.number().integer().default(10),
      skip: Joi.number().integer().default(0),
      name: Joi.string().min(3).max(100),
      power: Joi.string().min(3).max(25),
    });

    return {
      path: "/heroes",
      method: "GET",
      options: {
        tags: ['api', 'heroes'],
        description: 'should list heroes',
        notes: 'results can be paged and filtered by name and/or power',
        validate: {
          failAction: (request, headers, erro) => {
            throw erro;
          },
          query: schema,
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
    const schema = Joi.object({
      name: Joi.string().min(3).max(100).required(),
      power: Joi.string().min(3).max(25).required(),
      birthDate: Joi.string(),
    });

    return {
      path: "/heroes",
      method: "POST",
      options: {
        tags: ['api',  'heroes'],
        description: 'should register heroes',
        notes: 'should register hero by name and power',
        validate: {
          failAction: (request, headers, erro) => {
            throw erro;
          },
          payload: schema,
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
    const payloadSchema = Joi.object({
      name: Joi.string().min(3).max(100),
      power: Joi.string().min(3).max(25),
      birthDate: Joi.string(),
    });

    const paramsSchema = Joi.object({
      id: Joi.string().required(),
    });

    return {
      path: "/heroes/{id}",
      method: "PATCH",
      options: {
        tags: ['api',  'heroes'],
        description: 'should update hero by id',
        notes: 'should update any field of hero by id',
        validate: {
          failAction: (request, headers, erro) => {
            throw erro;
          },
          params: paramsSchema,
          payload: payloadSchema,
        },
      },
      handler: async (request) => {
        try {
          const { payload } = request;
          const { id } = request.params;

          const data = JSON.parse(JSON.stringify(payload));

          const result = await this.db.update(id, data);
          if(!result) {
            return Boom.preconditionFailed('Hero id not exist');
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
    const schema = Joi.object({
      id: Joi.string().required(),
    });

    return {
      path: "/heroes/{id}",
      method: "DELETE",
      options: {
        tags: ['api', 'heroes'],
        description: 'should remove hero by id',
        notes: 'should remove hero by id',
        validate: {
          failAction: (request, headers, erro) => {
            throw erro;
          },
          params: schema,
        },
      },
      handler: async (request) => {
        try {
          const { id } = request.params;

          const result = await this.db.delete(id);

          if(!result) {
            return Boom.preconditionFailed('Hero id not exist');
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
