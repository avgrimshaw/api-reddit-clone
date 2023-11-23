const format = require("pg-format");
const db = require("../db/connection");

exports.selectArticleById = (article_id) => {
  const articlesByIdQuery = format(
    `SELECT * FROM articles
    WHERE article_id = %L;`,
    [article_id]
  );
  return db.query(articlesByIdQuery).then(({ rows }) => {
    if (!rows.length) {
      return Promise.reject({ status: 404, msg: "Not found" });
    }
    return rows[0];
  });
};

exports.selectCommentsById = (article_id) => {
  const commentsByIdQuery = format(
    `SELECT * FROM comments
    WHERE article_id = %L;`,
    [article_id]
  );
  return db.query(commentsByIdQuery).then(({ rows }) => {
    if (!rows.length) {
      return Promise.reject({ status: 404, msg: "Not found" });
    }
    return rows[0];
  });
};
