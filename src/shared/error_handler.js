const fs = require("fs");
const _path = require("path");
const dayjs = require("dayjs");
module.exports = ({ path, error }) => {
  try {
    const timestamp = dayjs().format("DD-MM-YYYY_HH-mm-ss");
    const fileName = `error_${timestamp}.json`;
    const logEntry = {
      timestamp: dayjs().format("DD/MM/YYYY HH:mm:ss"),
      message: error.message,
    };
    fs.writeFileSync(
      _path.join(path, fileName),
      JSON.stringify(logEntry, null, 2)
    );
  } catch (error) {
    process.exit(1);
  }
};
