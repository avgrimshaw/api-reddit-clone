const { selectArticleById } = require("../models/articles.model");

exports.getArticleById = (req, res, next) => {
  return selectArticleById(req)
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
      res.status(200).send({ articles: rows });
    })
    .catch(next);
};
