const { readEndpointsJson } = require("../models/api.model");

exports.getEndpointsJson = (req, res, next) => {
  readEndpointsJson()
    .then((endpoints) => res.status(200).send({ endpoints }))
    .catch(next);
};
