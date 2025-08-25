const fs = require("fs");
module.exports = (paths = []) => {
  for (const path of paths) {
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path, { recursive: true });
    }
  }
};
