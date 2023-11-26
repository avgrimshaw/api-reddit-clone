const express = require("express");
const { getAllTopics } = require("./controllers/topics.controller");
const { getEndpointsJson } = require("./controllers/api.controller");
const {
  handleCustomErrors,
  handlePsqlErrors,
  handleServerErrors,
} = require("./errors");
const {
  getCommentsById,
  postComment,
  patchVotes,
  deleteComment,
} = require("./controllers/comments.controller");
const {
  getAllArticles,
  getArticleById,
  getArticlesByTopic,
} = require("./controllers/articles.controller");
const { getAllUsers } = require("./controllers/users.controller");
const app = express();

app.use(express.json());

app.get("/api", getEndpointsJson);

app.get("/api/topics", getAllTopics);

app.get("/api/articles", getAllArticles);
app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles/:article_id/comments", getCommentsById);
app.post("/api/articles/:article_id/comments", postComment);
app.delete("/api/comments/:comment_id", deleteComment);

app.patch("/api/articles/:article_id", patchVotes);

app.get("/api/users", getAllUsers);

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

module.exports = app;
