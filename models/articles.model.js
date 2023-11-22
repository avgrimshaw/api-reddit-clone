const format = require("pg-format");
const db = require("../db/connection");

exports.selectAllArticles = () => {
  return db
    .query(
      `SELECT * FROM articles
      ORDER BY created_at DESC;`
    )
    .then(({ rows }) => rows);
};

exports.selectArticleById = (article_id) => {
  const articlesByIdQuery = format(
    `SELECT * FROM articles
    WHERE article_id = %L`,
    [article_id]
  );
  return db.query(articlesByIdQuery).then(({ rows }) => {
    if (!rows.length) {
      return Promise.reject({ status: 404, msg: "Not found" });
    }
    return rows[0];
  });
};
