const db = require("../db/connection");

exports.selectAllTopics = (req) => {
  return db.query(`SELECT * FROM topics`);
};
