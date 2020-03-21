const assert = require("assert");
const nock = require("nock");

const { getPeoples } = require("./service");

describe("Star Wars Tests", function() {
  this.beforeAll(() => {
    const response = {
      count: 1,
      next: null,
      previus: null,
      results: [
        {
          name: "R2-D2",
          height: "96",
          mass: "32",
          hair_color: "n/a",
          skin_color: "white, blue",
          eye_color: "red",
          birth_year: "33BBY",
          homeworld: "https://swapi.co/api/planets/8/"
        }
      ]
    };
    nock("https://swapi.co/api/people")
      .get("/?search=r2-d2&format=json")
      .reply(200, response);
  });
  it("should search r2-d2 with correct format", async () => {
    const expected = [{ name: "R2-D2", height: "96" }];
    const baseName = "r2-d2";
    const result = await getPeoples(baseName);

    assert.deepEqual(result, expected);
  });
});
