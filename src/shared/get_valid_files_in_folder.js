const fs = require("fs");
const _path = require("path");
module.exports = ({ path = "", extensions = [] } = {}) => {
  const files = fs.readdirSync(path, { withFileTypes: true });
  const files_filtered = files.filter((f) => {
    const ext = _path.extname(f.name).slice(1).toLowerCase();
    return extensions.includes(ext);
  });
  return files_filtered
    .map((f) => ({
      name: _path.basename(f.name, _path.extname(f.name)),
      value: f.name,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
};
