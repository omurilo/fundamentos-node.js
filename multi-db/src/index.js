const contextStrategy = require('./db/strategies/base/context/strategy');
const MongoDB = require('./db/strategies/mongodb');
const PostgreSQL = require('./db/strategies/postgres');

const contextMongo = new contextStrategy(new MongoDB());
contextMongo.store({ name: 'Flash', power: 'Speeding' });

const contextPostgres = new contextStrategy(new PostgreSQL());
contextPostgres.store({ name: 'Batman', power: 'Money' });