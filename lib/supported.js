
const SUPPORTED_LANGUAGES = [
  "source.js"
];

function supportedInLanguageLayers(layers) {
  // Takes an array of scope names, and determines if any of them are supported

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
