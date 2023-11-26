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
