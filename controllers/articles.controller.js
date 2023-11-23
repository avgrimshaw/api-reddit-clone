const { checkArticleExists } = require("../db/seeds/utils");
const {
  selectArticleById,
  selectAllArticles,
} = require("../models/articles.model");

exports.getAllArticles = (req, res, next) => {
  return selectAllArticles(req)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  return selectArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

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
