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
    const test_id = "invalid_id";
    return request(app)
      .get(`/api/articles/${test_id}`)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual("Bad request");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  it("200: should increment votes when entity property 'inc_votes' has a positive value", () => {
    const test_id = 5;
    return request(app)
      .patch(`/api/articles/${test_id}`)
      .send({
        inc_votes: 100,
      })
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article).toMatchObject({
          article_id: 5,
          title: "UNCOVERED: catspiracy to bring down democracy",
          topic: "cats",
          author: "rogersop",
          created_at: "2020-08-03T13:14:00.000Z",
          votes: 100,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  it("200: should decrement votes when entity property 'inc_votes' has a negative value", () => {
    const test_id = 5;
    return request(app)
      .patch(`/api/articles/${test_id}`)
      .send({
        inc_votes: -50,
      })
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article).toMatchObject({
          article_id: 5,
          title: "UNCOVERED: catspiracy to bring down democracy",
          topic: "cats",
          author: "rogersop",
          created_at: "2020-08-03T13:14:00.000Z",
          votes: -50,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  it("404: should respond with error message when passed valid, but non-existent :article_id", () => {
    const test_id = articlesData.length + 1;
    return request(app)
      .patch(`/api/articles/${test_id}`)
      .send({
        inc_votes: -50,
      })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toEqual("Not found");
      });
  });
  it("400: should respond with error message when passed an invalid :article_id", () => {
    const test_id = "invalid_id";
    return request(app)
      .patch(`/api/articles/${test_id}`)
      .send({
        inc_votes: -50,
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual("Bad request");
      });
  });
});
