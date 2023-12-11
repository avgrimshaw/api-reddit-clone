const fs = require("fs/promises");

exports.readEndpointsJson = () => {
  return Promise.resolve(
    fs.readFile(`${__dirname}/../endpoints.json`, "utf-8", (error, data) => {
      if (error) {
        console.log(error);
        return error;
      }
      return JSON.parse(`${data}`);
    })
  );
};
