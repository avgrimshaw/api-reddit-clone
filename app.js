const express = require("express");
const { getAllTopics } = require("./controllers/topics.controller");
const { handleServerErrors } = require("./errors");
const { getEndpointsJson } = require("./controllers/api.controller");
const app = express();

app.get("/api/topics", getAllTopics);

app.get("/api", getEndpointsJson);

app.use(handleServerErrors);

module.exports = app;
