const app = require("../app");
const request = require("supertest");

describe("GET /api", () => {
  it("200: should return an object with correct description for all available endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        const endpointsJson = JSON.parse(body.endpoints);
        const endpointPaths = Object.keys(endpointsJson);
        endpointPaths.forEach((endpointPath) => {
          if (endpointPath.slice(-4) === "/api") {
            expect(endpointsJson[endpointPath]).toMatchObject({
              description: expect.any(String),
            });
          } else {
            expect(endpointsJson[endpointPath]).toEqual({
              description: expect.any(String),
              queries: expect.any(Array),
              exampleResponse: expect.any(Object),
            });
          }
        });
      });
  });
  it("200: 'exampleResponse' should contain correct property key and an array value which it''s object item should contain correct properties", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        const endpointsJson = JSON.parse(body.endpoints);
        const endpointPaths = Object.keys(endpointsJson);
        endpointPaths.forEach((endpointPath) => {
          const endpointPathSplit = endpointPath.split("/");
          const currentPath = endpointPathSplit.at(-1);
          const endpoint = endpointsJson[endpointPath];
          if (currentPath !== "api") {
            expect(endpoint["exampleResponse"]).toHaveProperty(
              [currentPath],
              expect.any(Array)
            );
          }
        });
      });
  });
});
