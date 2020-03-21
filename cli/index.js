const Commander = require("commander");

const Database = require("./database");
const Hero = require("./hero");

(async function main() {
  Commander.version("v1")
    .option("-n, --name [value]", "Hero Name")
    .option("-p, --power [value]", "Hero Power")
    .option("-l, --list", "List heros")
    .option("-s, --search [value]", "Search a hero by id")
    .option("-c, --create", "Save a hero")
    .option("-u, --update [value]", "Update a hero by id")
    .option("-r, --remove [value]", "Remove a hero by id")
    .parse(process.argv);

  const hero = new Hero(Commander);
  try {
    if (Commander.create) {
      delete hero.id;
      const result = await Database.store(hero);
      if (!result) {
        return console.error("Hero hasn't been registered");
      }
      return console.log("Hero registered with success!");
    } else if (Commander.search) {
      delete hero.id;
      const idToSearch = parseInt(Commander.search);
      const result = await Database.search(idToSearch);
      return console.log(result);
    } else if (Commander.list) {
      const result = await Database.search();
      return console.log(result);
    } else if (Commander.update) {
      const idToUpdate = parseInt(Commander.update);
      const newData = JSON.stringify(hero);
      const heroUpdated = JSON.parse(newData);
      const result = await Database.update(idToUpdate, heroUpdated);
      if (!result) {
        return console.error("Hero hasn't been updated");
      }
      return console.log("Hero updated with success!");
    } else if (Commander.remove) {
      const idToRemove = parseInt(Commander.remove)
      const result = await Database.remove(idToRemove);
      if (!result) {
        return console.error("Hero hasn't been removed");
      }
      return console.log("Hero removed with success!");
    }
  } catch (error) {
    console.error("DEU RUIM", error);
  }
})();
