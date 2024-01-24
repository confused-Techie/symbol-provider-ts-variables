const path = require("path");
const fs = require("fs-plus");
const temp = require("temp");
const Provider = require("../lib/ts-variable-provider.js");

// Just for syntax highlighting
function scm(strings) {
  return strings.join("");
}

function getEditor() {
  return atom.workspace.getActiveTextEditor();
}

async function wait(ms) {
  return new Promise(r => setTimeout(r, ms));
}

let provider;

async function getSymbols(editor, type = "file") {
  let controller = new AbortController();
  let symbols = await provider.getSymbols({
    type,
    editor,
    signal: controller.signal
  });

  return symbols;
}

describe("TsVariableProvider", () => {
  let directory, editor;

  beforeEach(async () => {
    jasmine.unspy(global, "setTimeout");
    jasmine.unspy(Date, "now");

    atom.config.set("core.useTreeSitterParsers", true);
    atom.config.set("core.useExperimentalModernTreeSitter", true);
    await atom.packages.activatePackage("language-javascript");

    atom.config.set("symbol-provider-ts-variables.strictSupport", false);

    provider = new Provider();

    atom.project.setPaths([
      temp.mkdirSync("other-dir-"),
      temp.mkdirSync("atom-symbols-view-")
    ]);

    directory = atom.project.getDirectories()[1];
    fs.copySync(
      path.join(__dirname, "fixtures", "js"),
      atom.project.getPaths()[1]
    );

    // other spec dirs
  });

  describe("when a tree-sitter grammar is used for a file", () => {
    beforeEach(async () => {
      await atom.workspace.open(directory.resolve("sample.js"));
      editor = getEditor();
      let languageMode = editor.getBuffer().getLanguageMode();
      await languageMode.ready;
    });

    it("is willing to provide symbols for the current file", () => {
      let meta = { type: "file", editor };
      expect(provider.canProvideSymbols(meta)).toBe(1);
    });

    it("is not willing to provide symbols for an entire project", () => {
      let meta = { type: "project", editor };
      expect(provider.canProvideSymbols(meta)).toBe(false);
    });

    it("provides all JavaScript Variables", async () => {
      let symbols = await getSymbols(editor, "file");

      expect(symbols[0].name).toBe("quicksort");
      expect(symbols[0].position.row).toEqual(0);

      expect(symbols[1].name).toBe("sort");
      expect(symbols[1].position.row).toEqual(1);

      expect(symbols[2].name).toBe("pivot");
      expect(symbols[2].position.row).toEqual(3);

      expect(symbols[3].name).toBe("current");
      expect(symbols[3].position.row).toEqual(3);

      expect(symbols[4].name).toBe("left");
      expect(symbols[4].position.row).toEqual(3);

      expect(symbols[5].name).toBe("right");
      expect(symbols[5].position.row).toEqual(3);
    });
  });

  describe("when a non-tree-sitter grammar is used for a file", () => {
    beforeEach(async () => {
      atom.config.set("core.useTreeSitterParsers", false);
      atom.config.set("core.useExperimentalModernTreeSitter", false);
      await atom.workspace.open(directory.resolve("sample.js"));
      editor = getEditor();
    });

    it("is not willing to provide symbols for the current file", () => {
      expect(editor.getGrammar().rootLanguageLayer).toBe(undefined);
      let meta = { type: "file", editor };
      expect(provider.canProvideSymbols(meta)).toBe(false);
    });
  });
});
