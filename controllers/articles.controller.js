const { selectArticleById } = require("../models/articles.model");

exports.getAllArticles = (req, res, next) => {};

exports.getArticleById = (req, res, next) => {
  return selectArticleById(req)
    .then((article) => {
      if (!article.length) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
      res.status(200).send({ article });
    })
    .catch(next);
};
