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
const articlesData = require("../db/data/test-data/articles");

beforeEach(() => {
  return seed({ topicData, userData, articleData, commentData });
});

afterAll(() => {
  return db.end();
});

describe("GET /api/articles/:article_id", () => {
  it("200: should return an article object which contains articles by the given ':article_id' parameter", () => {
    const test_id = 1;
    return request(app)
      .get(`/api/articles/${test_id}`)
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article.article_id).toEqual(test_id);
      });
  });
  it("404: should respond a message ':article_id' parameter does not exist", () => {
    const test_id = articlesData.length + 1;
    return request(app)
      .get(`/api/articles/${test_id}`)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toEqual("Not found");
      });
  });
  it("400: should respond a message if the given ':article_id' parameter is an invalid request", () => {
    const test_id = "bad_request";
    return request(app)
      .get(`/api/articles/${test_id}`)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual("Bad request");
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  it("200: should return an array of comments matching the given article_id parameter", () => {
    const test_id = 1;
    return request(app)
      .get(`/api/articles/${test_id}/comments`)
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;

        comments.forEach((comment) => {
          expect(comment).toHaveProperty("article_id", test_id);
        });
      });
  });
  it("404: should respond a message when the given':article_id' parameter does not exist in comments", () => {
    const test_id = articlesData.length + 1;
    return request(app)
      .get(`/api/articles/${test_id}/comments`)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toEqual("Not found");
      });
  });
});
