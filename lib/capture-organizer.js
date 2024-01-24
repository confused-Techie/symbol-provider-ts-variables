
module.exports =
function captureOrganizer(captures, scope) {
  let results = [];

  for (capture of captures) {
    let obj = {};

    obj.name = capture.node.text;
    obj.position = capture.node.range.start;
    obj.tag = getTag(capture, scope);
    obj.icon = "icon-code";

    results.push(obj);
  }

  return results;
}

function getTag(capture, scope) {
  const def = "Variable";
  const provided = capture.node.parent.previousSibling?.text ?? false;

  if (!provided) {
    return def;
  }

  switch(scope) {
    case "source.js": {
      switch(provided) {
        case "let":
          return "Local Variable";
        case "const":
          return "Constant Variable";
        case "var":
          return "Variable";
      }
    }
    case "source.java": {
      switch(provided) {
        case "int":
          return "Integer";
        case "double":
          return "Float";
      }
    }
    // No matching scope
    default:
      return provided;
  }
}
