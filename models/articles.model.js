const format = require("pg-format");
const db = require("../db/connection");

exports.selectArticleById = (req) => {
  const { article_id } = req.params;
  const articlesByIdQuery = format(
    `SELECT * FROM articles
    WHERE article_id = %L`,
    [article_id]
  );
  return db.query(articlesByIdQuery);
};
