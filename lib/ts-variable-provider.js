/**
 * Much of this file is directly taken from:
 * https://github.com/pulsar-edit/pulsar/tree/master/packages/symbol-provider-tree-sitter
 * Author: savetheclocktower
 */

const { Emitter } = require("atom");
const getQuery = require("./get-query.js");
const captureOrganizer = require("./capture-organizer.js");
const supported = require("./supported.js");

module.exports =
class TSVariableProvider {
  constructor() {
    this.packageName = "symbol-provider-ts-variables";
    this.name = "TreeSitter-Variables";
    this.isExclusive = false;
    this.emitter = new Emitter();
    this.captureOrganizer = captureOrganizer;
    this.disposable = atom.config.onDidChange("symbol-provider-ts-variables", () => {
      // Signal the consumer to clear its cache whenever we change the package
      // config
      this.emitter.emit("should-clear-cache", { provider: this });
    });
  }

  destroy() {
    this.disposable.dispose();
  }

  onShouldClearCache(callback) {
    return this.emitter.on("should-clear-cache", callback);
  }

  canProvideSymbols(meta) {
    let { editor, type } = meta;

    // This provider can't crawl the whole project
    if (type === "project" || type === "project-find") return false;

    // This provider works only for editors with Tree-sitter grammars
    let languageMode = editor?.getBuffer()?.getLanguageMode();
    if (languageMode?.constructor.name !== "WASMTreeSitterLanguageMode") {
      return false;
    }

    // While the rest of this check is taken directly from `symbol-provider-tree-sitter`
    // We now differ to ensure we support at least one active language layer
    let canSupport = supported.supportedInLanguageLayers(languageMode.getAllLanguageLayers());
    if (!canSupport) {
      return false;
    }

    // Not sure what value is best to return here,
    // but we likely would also want to check for what kind of file we are
    // working in to know if we actually support it, otherwise we can return 1
    // since we are a supplimental provider
    return 1;
  }

  async getSymbols(meta) {
    let { editor, signal } = meta;
    let languageMode = editor?.getBuffer()?.getLanguageMode();
    if (!languageMode) return null;

    let scopeResolver = languageMode?.rootLanguageLayer?.scopeResolver;
    if (!scopeResolver) return null;
    // What is the aboves purpose??

    // Wait for the buffer to be at rest so we know we're capturing agaist
    // clean trees
    await languageMode.atTransactionEnd();

    // The symbols-view package might've cancelled on us in the meantime
    if (signal.aborted) return null;

    // We need to inspect the available language layers
    let layers = languageMode.getAllLanguageLayers();

    let results = [];

    for (let layer of layers) {
      let queryFile = getQuery(layer.languageScope);
      if (!queryFile) {
        // We don't have a tag query for this language layer, so skip
        continue;
      }

      let extent = layer.getExtent();
      let query = await languageMode.grammar.createQuery(queryFile);

      let captures = query.captures(
        layer.tree.rootNode,
        extent.start,
        extent.end
      );
      console.log(captures);

      results.push(
        ...this.captureOrganizer(captures)
      );
    }

    results.sort((a, b) => a.position.compare(b.position));
    return results;
  }
}
