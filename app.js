const express = require("express");
const { getAllTopics } = require("./controllers/topics.controller");
const { handleServerErrors, handle404 } = require("./errors");
const { getEndpointsJson } = require("./controllers/api.controller");
const { getArticleById } = require("./controllers/articles.controller");
const app = express();

app.get("/api", getEndpointsJson);

app.get("/api/topics", getAllTopics);

app.get("/api/articles/:article_id", getArticleById);

app.use(handle404);
app.use(handleServerErrors);

module.exports = app;
