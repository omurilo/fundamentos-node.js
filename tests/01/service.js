const { get } = require('axios');

const baseUrl = 'https://swapi.co/api/people';

const getPeoples = async name => {
  const url = `${baseUrl}/?search=${name}&format=json`;
  const result = await get(url);

  return result.data.results.map(mapPeople);
}

const mapPeople = item => {
  return {
    name: item.name,
    height: item.height,
  }
}

module.exports = { getPeoples };