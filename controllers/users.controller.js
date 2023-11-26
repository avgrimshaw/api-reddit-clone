const { selectAllUsers } = require("../models/users.model");

exports.getAllUsers = (req, res, next) => {
  return selectAllUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch(next);
};
