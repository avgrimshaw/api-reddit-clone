const { selectAllTopics } = require("../models/topics.model");

exports.getAllTopics = (req, res, next) => {
  return selectAllTopics(req)
    .then(({ rows }) => {
      if (!rows) {
        return Promise.reject({ status: 404, msg: "Topics not found" });
      } else {
        res.status(200).send({ topics: rows });
      }
    })
    .catch(next);
};
