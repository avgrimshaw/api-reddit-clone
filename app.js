const express = require("express");
const { getAllTopics } = require("./controllers/topics.controller");
const {
  handleServerErrors,
  handle404,
  handlePsqlErrors,
  handleCustomErrors,
} = require("./errors");
const { getEndpointsJson } = require("./controllers/api.controller");
const {
  getAllArticles,
  getArticleById,
  getCommentsById,
  postComment,
  patchVotes,
} = require("./controllers/articles.controller");
const app = express();

app.use(express.json());

app.get("/api", getEndpointsJson);

app.get("/api/topics", getAllTopics);

app.get("/api/articles", getAllArticles);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles/:article_id/comments", getCommentsById);

app.post("/api/articles/:article_id/comments", postComment);

app.patch("/api/articles/:article_id", patchVotes);

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

module.exports = app;
