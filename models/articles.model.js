const format = require("pg-format");
const db = require("../db/connection");

exports.selectAllArticles = () => {
  return db.query(`SELECT * FROM articles`);
};

exports.selectArticleById = (req) => {
  const { article_id } = req.params;
  const articlesByIdQuery = format(
    `SELECT * FROM articles
    WHERE article_id = %L`,
    [article_id]
  );
  return db.query(articlesByIdQuery).then(({ rows }) => rows);
};
