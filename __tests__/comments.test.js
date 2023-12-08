const db = require("../db/connection");
const app = require("../index");
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
const commentsData = require("../db/data/test-data/comments");

beforeEach(() => {
  return seed({ topicData, userData, articleData, commentData });
});

afterAll(() => {
  return db.end();
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
  it("400: should respond with an message if the given ':article_id' parameter is an invalid request", () => {
    const test_id = "invalid_id";
    return request(app)
      .get(`/api/articles/${test_id}/comments`)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual("Bad request");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
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
  it("201: should ignore any additional properties other than ones required", () => {
    const test_id = 1;
    return request(app)
      .post(`/api/articles/${test_id}/comments`)
      .send({
        username: "lurker",
        body: "This is my comment",
        extra: "extra property",
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
  it("404: should respond with error message when passed valid, but non-existent :article_id", () => {
    const test_id = articlesData.length + 1;
    return request(app)
      .post(`/api/articles/${test_id}/comments`)
      .send({
        username: "lurker",
        body: "This is my comment",
      })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toEqual("Not found");
      });
  });
  it("400: should respond with error message when passed properties are missing and/or have invalid data type values - TEST ONE", () => {
    const test_id = 1;
    return request(app)
      .post(`/api/articles/${test_id}/comments`)
      .send({
        username: 12,
        body: 14,
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual("Bad request");
      });
  });
  it("400: should respond with error message when passed properties are missing and/or have invalid data type values - TEST TWO", () => {
    const test_id = 1;
    return request(app)
      .post(`/api/articles/${test_id}/comments`)
      .send({
        username: "lurker",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual("Bad request");
      });
  });
  it("400: should respond with error message when passed properties are missing and/or have invalid data type values - TEST THREE", () => {
    const test_id = 1;
    return request(app)
      .post(`/api/articles/${test_id}/comments`)
      .send({
        body: "This is my comment",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual("Bad request");
      });
  });
  it("400: should respond with error message when passed properties are missing and/or have invalid data type values - TEST FOUR", () => {
    const test_id = 1;
    return request(app)
      .post(`/api/articles/${test_id}/comments`)
      .send({})
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual("Bad request");
      });
  });
  it("400: should respond with error message when passed an invalid :article_id", () => {
    const test_id = "invalid_id";
    return request(app)
      .post(`/api/articles/${test_id}/comments`)
      .send({
        username: "lurker",
        body: "This is my comment",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual("Bad request");
      });
  });
  it("400: should respond with error message when passed a non-existent username", () => {
    const test_id = "1";
    return request(app)
      .post(`/api/articles/${test_id}/comments`)
      .send({
        username: "non-existent",
        body: "This is my comment",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual("Bad request");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  it("204: should return correct response status and message when when comment with passed ':comment_id' has been deleted ", () => {
    const test_id = 6;
    return request(app)
      .delete(`/api/comments/${test_id}`)
      .expect(204)
      .then(({ body }) => {
        expect(body).toEqual({});
      })
      .then(() => {
        return db.query(`SELECT * FROM comments;`);
      })
      .then(({ rows }) => {
        rows.forEach((comment) => {
          expect(comment.comment_id).not.toEqual(test_id);
        });
      });
  });
  it("404: should respond with an error message when passed a valid, but non-existent :comment_id", () => {
    const test_id = commentsData.length + 1;
    return request(app)
      .delete(`/api/comments/${test_id}`)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toEqual("Not found");
      });
  });
  it("400: should respond with an error message when passed an invalid :comment_id", () => {
    const test_id = "invalid_id";
    return request(app)
      .delete(`/api/comments/${test_id}`)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual("Bad request");
      });
  });
});
