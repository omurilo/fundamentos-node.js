const { readFile, writeFile } = require('fs');
const { promisify } = require('util');

const readFileAsync = promisify(readFile);
const writeFileAsync = promisify(writeFile);

class Database {
  constructor() {
    this.ARCHIVE_NAME = 'heros.json';
  }
  async getArchiveData(){
    const archive = await readFileAsync(this.ARCHIVE_NAME, 'utf8');
    return JSON.parse(archive.toString());
  }
  async writeArchive(data){
    await writeFileAsync(this.ARCHIVE_NAME, JSON.stringify(data));
    return true;
  }
  async save(hero) {
    const heros = await this.getArchiveData();
    const id = hero.id <= 2 ? hero.id : Math.floor(Math.random() * (10e5 - 3) + 3);
    const heroWithId = { ...hero, id };
    const newHeros = heros.filter(item => item.id !== id);
    newHeros.push(heroWithId);
    const result = await this.writeArchive(newHeros);
    return result;
  }
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