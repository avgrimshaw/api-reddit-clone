const format = require("pg-format");
const db = require("../db/connection");

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

exports.deleteCommentById = (comment_id) => {
  const deleteCommentQuery = format(
    `DELETE FROM comments
    WHERE comment_id = %L;`,
    [comment_id]
  );
  return db.query(deleteCommentQuery);
};
