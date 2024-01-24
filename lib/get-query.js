const fs = require("fs");
const path = require("path");
const supported = require("./supported.js");

module.exports =
function getQuery(scope) {
  let filename = "";

  switch(scope) {
    // If we need to create a different tag to support a particular language
    // we would add it here. Although I haven't found that case yet
    default:
      filename = "";
      break;
  }

  if (filename === "") {
    // We didn't match anything. Lets check if this scope is in our default
    // supported scopes, or if we are somehow inside a scope we don't actually
    // support.

    if (supported.SUPPORTED_LANGUAGES.includes(scope)) {
      filename = "./queries/tags.scm";
    } else if (!atom.config.get("symbol-provider-ts-variables.strictSupport")) {
      // While we don't know we support the language, the user hasn't enabled
      // strict support, so lets try anyway
      filename = "./queries/tags.scm";
    } else {
      // we ended up in a scope we don't support
      return false;
    }
  }

  let file = fs.readFileSync(path.resolve(__dirname, filename), { encoding: "utf8" });

  return file;
}
