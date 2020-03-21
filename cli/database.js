const { readFile } = require('fs');
const { promisify } = require('util');

const readFileAsync = promisify(readFile);

class Database {
  constructor() {
    this.ARCHIVE_NAME = 'heros.json';
  }
  async getArchiveData(){
    const archive = await readFileAsync(this.ARCHIVE_NAME, 'utf8');
    return JSON.parse(archive.toString());
  }
  writeArchive(){}
  async search(id){
    const data = await this.getArchiveData();
    const dataFiltered = data.filter(item => {
      if (id) {
        return item.id === id;
      }

      return true;
    });
    return dataFiltered;
  }
}

module.exports = new Database();