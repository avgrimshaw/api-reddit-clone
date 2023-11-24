const format = require("pg-format");
const db = require("../db/connection");
const { articleData } = require("../db/data/test-data");

exports.selectAllArticles = () => {
  return db
    .query(
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
      ORDER BY articles.created_at DESC`
    )
    .then(({ rows }) => rows);
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

exports.selectCommentsById = (article_id) => {
  const commentsByIdQuery = format(
    `SELECT * FROM comments
    WHERE article_id = %L
    ORDER BY created_at ASC;`,
    [article_id]
  );
  return db.query(commentsByIdQuery).then(({ rows }) => rows);
};

exports.insertComment = (body, article_id) => {
  const insertCommentQuery = format(
    `INSERT INTO comments
    (author, body, article_id)
    VALUES
    %L
    RETURNING *;`,
    [[body.username, body.body, article_id]]
  );
  return db.query(insertCommentQuery).then(({ rows }) => rows[0]);
};

exports.updateVotes = (body, article_id) => {
  let updateVotesBy = null;
  if (body.inc_votes >= 0) {
    updateVotesBy = `+ ${body.inc_votes}`;
  } else {
    const incVotesPositive = (body.inc_votes *= -1);
    updateVotesBy = `- ${incVotesPositive}`;
  }
  const updateVotesQuery = format(
    `UPDATE articles
    SET votes = votes %s
    WHERE article_id = %L
    RETURNING *;`,
    [updateVotesBy],
    [article_id]
  );
  return db.query(updateVotesQuery).then(({ rows }) => rows[0]);
};
