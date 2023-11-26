const format = require("pg-format");
const db = require("../db/connection");

exports.selectAllArticles = (topic) => {
  const numRegEx = /\d+/;
  if (numRegEx.test(topic)) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }

  let whereTopicQuery = ``;

  if (topic) {
    whereTopicQuery = format(`WHERE articles.topic = %L`, [topic]);
  }

  const articlesQuery = format(
    `SELECT
      articles.article_id,
      articles.title,
      articles.topic,
      articles.author,
      articles.created_at,
      articles.votes,
      articles.article_img_url,
      COALESCE(comment_count, 0) AS comment_count
    FROM articles
    LEFT JOIN (
      SELECT
        article_id,
        COUNT(*) AS comment_count
      FROM comments
      GROUP BY article_id) AS comment_sum
    ON articles.article_id = comment_sum.article_id
    %s
    ORDER BY articles.created_at DESC;`,
    [whereTopicQuery]
  );

  return db.query(articlesQuery).then(({ rows }) => rows);
};

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
