
module.exports =
function captureOrganizer(captures) {
  let results = [];

  for (capture of captures) {
    let obj = {};

    obj.name = capture.node.text;
    obj.shortName = "shortName?";
    obj.position = capture.node.range.start;
    obj.tag = getTag(capture);
    obj.icon = "icon-code";

    results.push(obj);
  }

  return results;
}

function getTag(capture) {
  const def = "Variable";
  const provided = capture.node.parent.previousSibling?.text ?? false;

  if (!provided) {
    return def;
  }

  switch(provided) {
    case "let":
      return "Local Variable";
    case "const":
      return "Constant Variable";
    case "var":
      return "Variable";
    default:
      return def;
  }
}
