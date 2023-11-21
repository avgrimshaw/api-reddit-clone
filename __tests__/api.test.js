const app = require("../app");
const request = require("supertest");

describe("GET /api", () => {
  it("200: should return an object with correct description for all available endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        const endpointsJson = require("../endpoints.json");
        const returned = JSON.parse(body.endpoints);
        expect(endpointsJson).toMatchObject(returned);
      });
  });
});
