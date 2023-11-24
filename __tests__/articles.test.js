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
const articlesData = require("../db/data/test-data/articles");

beforeEach(() => {
  return seed({ topicData, userData, articleData, commentData });
});

afterAll(() => {
  return db.end();
});

describe("GET /api/articles", () => {
  it("200: should return all articles sorted by date in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeSorted(articles.created_at);
      });
  });
  it("200: should return all articles containing joined comment_count selected from comments data table", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        articles.forEach((article) => {
          expect(article).toMatchObject({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(String),
          });
        });
      });
  });
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
  it("200: should return an array of comments matching the given :article_id parameter and sorted by most recent (created_at)", () => {
    const test_id = 1;
    return request(app)
      .get(`/api/articles/${test_id}/comments`)
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toBeSorted({
          key: "created_at",
          descending: false,
        });
        comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            body: expect.any(String),
            article_id: expect.any(Number),
            author: expect.any(String),
            votes: expect.any(Number),
            created_at: expect.any(String),
          });
        });
      });
  });
  it("200: should return an empty array if there article with given :article_id parameter exists but has no comments", () => {
    let test_id = 4;
    return request(app)
      .get(`/api/articles/${test_id}/comments`)
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toEqual([]);
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
  it("400: should respond a message if the given ':article_id' parameter is an invalid request", () => {
    const test_id = "bad_request";
    return request(app)
      .get(`/api/articles/${test_id}/comments`)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual("Bad request");
      });
  });
});

describe.only("POST /api/articles/:article_id/comments", () => {
  it("201: should post comment to comments data table with correct properties", () => {
    const test_id = 1;
    return request(app)
      .post(`/api/articles/${test_id}/comments`)
      .send({
        username: "lurker",
        body: "This is my comment",
      })
      .expect(201)
      .then(({ body }) => {
        const { comment } = body;
        expect(comment).toMatchObject({
          comment_id: expect.any(Number),
          body: "This is my comment",
          article_id: test_id,
          author: "lurker",
          votes: expect.any(Number),
          created_at: expect.any(String),
        });
      });
  });
  it("400: should respond with error message when passed invalid article_id", () => {
    const test_id = articlesData.length + 1;
    return request(app)
      .post(`/api/articles/${test_id}/comments`)
      .expect(400)
      .send({
        username: "lurker",
        body: "This is my comment",
      })
      .then(({ body }) => {
        expect(body.msg).toEqual("Bad request");
      });
  });
  it("400: should respond with error messagae when passed properties are missing and/or have invalid data type values - TEST ONE", () => {
    const test_id = 1;
    return request(app)
      .post(`/api/articles/${test_id}/comments`)
      .expect(400)
      .send({
        username: 12,
        body: 14,
      })
      .then(({ body }) => {
        expect(body.msg).toEqual("Bad request");
      });
  });
  it("400: should respond with error messagae when passed properties are missing and/or have invalid data type values - TEST TWO", () => {
    const test_id = 1;
    return request(app)
      .post(`/api/articles/${test_id}/comments`)
      .expect(400)
      .send({
        username: "lurker",
      })
      .then(({ body }) => {
        expect(body.msg).toEqual("Bad request");
      });
  });
  it("400: should respond with error messagae when passed properties are missing and/or have invalid data type values - TEST THREE", () => {
    const test_id = 1;
    return request(app)
      .post(`/api/articles/${test_id}/comments`)
      .expect(400)
      .send({
        body: "This is my comment",
      })
      .then(({ body }) => {
        expect(body.msg).toEqual("Bad request");
      });
  });
  it("400: should respond with error messagae when passed properties are missing and/or have invalid data type values - TEST FOUR", () => {
    const test_id = 1;
    return request(app)
      .post(`/api/articles/${test_id}/comments`)
      .expect(400)
      .send({})
      .then(({ body }) => {
        expect(body.msg).toEqual("Bad request");
      });
  });
});
