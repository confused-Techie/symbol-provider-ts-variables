const fs = require("fs");
const path = require("path");

module.exports =
function getQuery(scope) {
  let filename = "";

  switch(scope) {
    case "source.js":
      filename = "./queries/js_tags.scm";
      break;
    default:
      filename = "";
      break;
  }

  if (filename === "") {
    return false;
  }

  let file = fs.readFileSync(path.resolve(__dirname, filename), { encoding: "utf8" });

  return file;
}
