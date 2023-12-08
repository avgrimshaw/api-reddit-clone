const db = require("../db/connection");
const app = require("../app");
const seed = require("../db/seeds/seed");
const {
  topicData,
  userData,
  articleData,
  commentData,
} = require("../db/data/test-data");
const request = require("supertest");
require("jest-sorted");

beforeEach(() => {
  return seed({ topicData, userData, articleData, commentData });
});

afterAll(() => {
  return db.end();
});

describe("GET /api/users", () => {
  it("200: should return all users from users data table with correct properties key/value pairs", () => {
    return request(app)
      .get("/api/users")
      .then(({ body }) => {
        const { users } = body;
        expect(users).toEqual(userData);
        users.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });
});
