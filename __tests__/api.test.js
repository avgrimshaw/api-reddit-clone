const app = require("../app");
const request = require("supertest");
const endpointsJson = require("../endpoints.json");

describe("GET /api", () => {
  it("200: should return an object with correct description for all available endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        const returned = body.endpoints;
        expect(endpointsJson).toMatchObject(returned);
      });
  });
});
