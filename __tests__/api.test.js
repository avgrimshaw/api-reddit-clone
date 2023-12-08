const app = require("../index");
const request = require("supertest");
const endpointsJson = require("../endpoints.json");

describe("GET /api", () => {
  it("200: should return an object with correct description for all available endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        const returned = JSON.parse(body.endpoints);
        expect(endpointsJson).toMatchObject(returned);
      });
  });
});
