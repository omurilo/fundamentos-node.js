class NotImplementedException extends Error {
  constructor(){
    super("This method is not implemented");
  }
}

class ICrud {
  index() {
    throw new NotImplementedException();
  }
  
  show() {
    throw new NotImplementedException();
  }

  store() {
    throw new NotImplementedException();
  }

  update() {
    throw new NotImplementedException();
  }

  delete() {
    throw new NotImplementedException();
  }

  isConnected() {
    throw new NotImplementedException();
  }

  static connect() {
    throw new NotImplementedException();
  }

  static defineModel() {
    throw new NotImplementedException();
  }
}

module.exports = ICrud;