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
            body: expect.any(String),
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
  it("200: should return an article object which contains articles by the given ':article_id' parameter and should include comment_count", () => {
    const test_id = 1;
    return request(app)
      .get(`/api/articles/${test_id}`)
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article).toEqual({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 100,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          comment_count: "11",
        });
      });
  });
  it("404: should respond with an error message ':article_id' parameter does not exist", () => {
    const test_id = articlesData.length + 1;
    return request(app)
      .get(`/api/articles/${test_id}`)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toEqual("Not found");
      });
  });
  it("400: should respond with an error message if the given ':article_id' parameter is an invalid request", () => {
    const test_id = "invalid_id";
    return request(app)
      .get(`/api/articles/${test_id}`)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual("Bad request");
      });
  });
});

describe("GET /api/articles?topic", () => {
  it("200: should return all articles with matching passed topic query with each containing correct properties", () => {
    const topic_query = "mitch";
    return request(app)
      .get(`/api/articles?topic=${topic_query}`)
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        articles.forEach((article) => {
          expect(article.topic).toEqual(`${topic_query}`);
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
  it("404: should return an error message when passed topic query is valid, but does not exist in any articles", () => {
    const topic_query = "pomegranates";
    return request(app)
      .get(`/api/articles?topic=${topic_query}`)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toEqual("Not found");
      });
  });
  it("400: should return an error message when passed an invalid topic query", () => {
    const topic_query = 10;
    return request(app)
      .get(`/api/articles?topic=${topic_query}`)
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
