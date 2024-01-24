const TSVariableProvider = require("./ts-variable-provider.js");

module.exports = {
  activate() {
    this.provider = new TSVariableProvider();
  },

  deactivate() {
    this.provider?.destroy?.();
    this.provider = null;
  },

  provideSymbols() {
    return this.provider;
  }
};
