const express = require("express");
const { getAllTopics } = require("./controllers/topics.controller");
const { handleServerErrors, handle404, handlePsqlErrors } = require("./errors");
const { getEndpointsJson } = require("./controllers/api.controller");
const {
  getArticleById,
  getCommentsById,
} = require("./controllers/articles.controller");
const app = express();

app.get("/api", getEndpointsJson);

app.get("/api/topics", getAllTopics);

app.get("/api/articles", getAllArticles);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles/:article_id/comments", getCommentsById);

app.use(handlePsqlErrors);
app.use(handle404);
app.use(handleServerErrors);

module.exports = app;
