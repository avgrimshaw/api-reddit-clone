const { checkTopicInArticlesExists } = require("../db/seeds/utils");
const {
  selectArticleById,
  selectAllArticles,
} = require("../models/articles.model");

exports.getAllArticles = (req, res, next) => {
  const { topic } = req.query;
  const articlesPromises = [selectAllArticles(topic)];

  if (topic) {
    articlesPromises.push(checkTopicInArticlesExists(topic));
  }

  Promise.all(articlesPromises)
    .then((resolvedPromises) => {
      const articles = resolvedPromises[0];
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
