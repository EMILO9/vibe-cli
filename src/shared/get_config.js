const fs = require("fs");
module.exports = (path = "") => {
  const filters = fs.readFileSync(path, "utf-8").split("\n").filter(Boolean);
  return filters;
};
