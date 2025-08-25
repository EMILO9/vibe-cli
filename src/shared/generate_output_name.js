const dayjs = require("dayjs");
module.exports = (extension = "") => {
  const timestamp = dayjs().format("YYYYMMDD_HHmmss");
  return `${timestamp}.${extension}`;
};
