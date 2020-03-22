const ICrud = require('../interface/crud');

class MongoDB extends ICrud {
  constructor() {
    super()
  }
  show(id) {
    return id;
  }

  store(item) {
    return console.log(`salvo com mongoDB: ${JSON.stringify(item, null, 2)}`);
  }
}

module.exports = MongoDB;