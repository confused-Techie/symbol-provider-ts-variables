
const SUPPORTED_LANGUAGES = [
  "source.js"
];

function supportedInLanguageLayers(arr) {
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
