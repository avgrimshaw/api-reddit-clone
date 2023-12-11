const jsonfile = require("jsonfile");

exports.readEndpointsJson = () => {
  return Promise.resolve(
    jsonfile
      .readFile(`${__dirname}/../endpoints.json`)
      .then((data) => {
        return data;
      })
      .catch((err) => {
        console.log(err);
      })
  );
};
