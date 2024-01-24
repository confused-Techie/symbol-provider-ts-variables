# Symbol-Provider-TS-Variables

Provides variables to `symbol-provider` on Tree-sitter grammars.

By default `symbols-provider-tree-sitter` doesn't provide variables from a grammar. This package adds variables to `symbols-view`.

## Installation & Setup

To ensure your installation of Pulsar is able to utilize this package:
  * Ensure you are on version `1.113.0` of Pulsar or above
  * Ensure you've enabled the new `symbols-view` package
  * Ensure you have enabled Modern Tree-sitter Grammars (`editor.useTreeSitterParsers` = `true` && `editor.useLegacyTreeSitterImplementation` = `false`)

Then install this package, as long as you are in a Modern Tree-Sitter supported grammar, you'll be able to use this package for symbols navigation.

## Grammar Support

This package is only able to support grammars using Modern Tree-sitter.
Otherwise, this package should support just about any grammar, the method used to retrieve variables from the grammar is rather universal across languages, but if you find a language that isn't supported quite right, feel free to submit an issue. Otherwise you can enable "Strict Support" in the package's settings to ensure it only provides symbols for the languages it has been tested in.

## TODO

  * [X] Add query cache, to avoid having to recreate queries for any languages we have already done so for.
  * [X] Validate `symbol` that's being returned to `symbol-provider`
  * [X] Obviously support many more languages, shoot for at least the languages supported by Pulsar by default
  * [ ] Validate the method of finding tag files once package is properly installed
  * [X] Use `const` or `let` either as the context, or as the tag for the symbol. Once I figure out how to get that information from tree sitter.
  * [ ] Include the scope of the variable as the context, which can also help clarify between duplicate variables in different scopes
