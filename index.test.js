const request = require("supertest");
// express app
const app = require("./index");

// db setup
const { sequelize, Dog } = require("./db");
const seed = require("./db/seedFn");
const { dogs } = require("./db/seedData");

describe("Endpoints", () => {
  // to be used in POST test
  const testDogData = {
    breed: "Poodle",
    name: "Sasha",
    color: "black",
    description: "Sasha is a beautiful black pooodle mix.  She is a great companion for her family.",
  };

  beforeAll(async () => {
    // rebuild db before the test suite runs
    await seed();
  });

  describe("GET /dogs", () => {
    it("should return list of dogs with correct data", async () => {
      // make a request
      const response = await request(app).get("/dogs");
      // assert a response code
      expect(response.status).toBe(200);
      // expect a response
      expect(response.body).toBeDefined();
      // toEqual checks deep equality in objects
      expect(response.body[0]).toEqual(expect.objectContaining(dogs[0]));
    });
  });

  describe("POST /dogs", () => {
    it("should respond with status 200 and the posted data for dogs", async () => {
      const response = await request(app).post("/dogs").send(testDogData);

      expect(response.status).toBe(200);
      expect(response.body.breed).toBe("Poodle");
      expect(response.body.name).toBe("Sasha");
      expect(response.body.color).toBe("black");
      expect(response.body.description).toBe(
        "Sasha is a beautiful black pooodle mix.  She is a great companion for her family."
      );
    });
  });

  describe("Test POST /dogs", () => {
    it("should create a dog and return it", async () => {
      const response = await request(app).post("/dogs").send({ name: "Fido", breed: "Labrador" });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("id");
      expect(response.body).toHaveProperty("name", "Fido");
      expect(response.body).toHaveProperty("breed", "Labrador");

      const dog = await Dog.findByPk(response.body.id);

      expect(dog).toHaveProperty("name", "Fido");
      expect(dog).toHaveProperty("breed", "Labrador");
    });
  });

  describe("Test DELETE /dogs/:id", () => {
    it("shoudl respond with status 200 and deleted data", async () => {
      const response = await request(app).delete("/dogs/1");
      expect(response.status).toBe(200);

      const dog = await Dog.findByPk(1);
      expect(dog).toBe(null);
    });
  });
});
