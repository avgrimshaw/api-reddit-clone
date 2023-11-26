const { checkArticleExists, checkCommentExists } = require("../db/seeds/utils");
const {
  selectCommentsById,
  insertComment,
  updateVotes,
  deleteCommentById,
} = require("../models/comments.model");

exports.getCommentsById = (req, res, next) => {
  const { article_id } = req.params;

  const commentsPromises = [selectCommentsById(article_id)];

  if (article_id) {
    commentsPromises.push(checkArticleExists(article_id));
  }

  Promise.all(commentsPromises)
    .then((resolvedPromises) => {
      const comments = resolvedPromises[0];
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.deleteComment = (req, res, next) => {
  const { comment_id } = req.params;

  const commentPromises = [checkCommentExists(comment_id)];

  if (comment_id) {
    commentPromises.push(deleteCommentById(comment_id));
  }
  Promise.all(commentPromises)
    .then((resolvedPromises) => {
      const deleted = resolvedPromises[1];
      res.status(204).send(deleted);
    })
    .catch(next);
};

exports.postComment = (req, res, next) => {
  const { body } = req;
  const { article_id } = req.params;

  const commentPromises = [checkArticleExists(article_id)];

  if (article_id) {
    commentPromises.push(insertComment(body, article_id));
  }

  Promise.all(commentPromises)
    .then((resolvedPromises) => {
      const comment = resolvedPromises[1];
      res.status(201).send({ comment });
    })
    .catch(next);
};

exports.patchVotes = (req, res, next) => {
  const { body } = req;
  const { article_id } = req.params;

  const votePromises = [checkArticleExists(article_id)];

  if (article_id) {
    votePromises.push(updateVotes(body, article_id));
  }

  Promise.all(votePromises)
    .then((resolvedPromises) => {
      const article = resolvedPromises[1];
      res.status(200).send({ article });
    })
    .catch(next);
};
