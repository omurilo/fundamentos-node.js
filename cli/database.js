const { readFile, writeFile } = require("fs");
const { promisify } = require("util");

const readFileAsync = promisify(readFile);
const writeFileAsync = promisify(writeFile);

class Database {
  constructor() {
    this.ARCHIVE_NAME = "heros.json";
  }
  async getArchiveData() {
    const archive = await readFileAsync(this.ARCHIVE_NAME, "utf8");
    return JSON.parse(archive.toString());
  }
  async writeArchive(data) {
    await writeFileAsync(this.ARCHIVE_NAME, JSON.stringify(data));
    return true;
  }
  async store(hero) {
    const heros = await this.getArchiveData();
    const id =
      hero.id <= 5 ? hero.id : Math.floor(Math.random() * (10e5 - 3) + 3);
    const heroWithId = { ...hero, id };
    heros.push(heroWithId);
    return this.writeArchive(heros);
  }
  async search(id) {
    const data = await this.getArchiveData();
    const dataFiltered = data.filter(item => {
      if (id) {
        return item.id === parseInt(id);
      }

      return true;
    });
    return dataFiltered;
  }
  async update(id, modifications) {
    const heros = await this.getArchiveData();
    const index = heros.findIndex(item => item.id === parseInt(id));

    if (index === -1) {
      throw Error(`id: ${id} - The informed hero not exist`);
    }

    const hero = heros[index];
    const updated = { ...hero, ...modifications };

    heros.splice(index, 1);
    return this.writeArchive([...heros, updated]);
  }
  async remove(id) {
    if (!id) {
      return this.writeArchive([]);
    }
    const heros = await this.getArchiveData();
    /** first option */
    const index = heros.findIndex(item => item.id === parseInt(id));

    if (index === -1) {
      throw Error(`id: ${id} - The informed hero not exist`);
    }

    heros.splice(index, 1);
    return this.writeArchive(heros);

    /** second option */
    // const deletedHero = heros.filter(hero => hero.id !== id);

    // return this.writeArchive(deletedHero);
  }
}

module.exports = new Database();
