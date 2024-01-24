/**
 * Support is a funny thing. Due to the simplicity of the query we use
 * to find variable declarations, and the awesome consistency found in Tree-sitter
 * I've yet to find a language this package doesn't support out of the box.
 * So what we can do is by default support just about everything,
 * meanwhile we will keep a list of known supported languages here.
 * Which given a config value the user can enable strict support, which
 * will ensure we only support what we know works.
 */

const SUPPORTED_LANGUAGES = [
  "source.js",
  "source.java"
];

function supportedInLanguageLayers(layers) {
  // Takes an array of scope names, and determines if any of them are supported

  if (!atom.config.get("symbol-provider-ts-variables.strictSupport")) {
    // If we haven't enabled strictSupport, lets give it a try and say we
    // support this one
    return true;
  }

  let isSupported = false;

  for (let layer of layers) {
    let scope = layer.languageScope;

    if (SUPPORTED_LANGUAGES.includes(scope)) {
      isSupported = true;
    }
  }

  return isSupported;
}

module.exports = {
  SUPPORTED_LANGUAGES,
  supportedInLanguageLayers,
};
