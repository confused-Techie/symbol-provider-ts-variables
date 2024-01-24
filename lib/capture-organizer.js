
module.exports =
function captureOrganizer(captures) {
  let results = [];

  for (capture of captures) {
    let obj = {};

    obj.name = capture.node.text;
    obj.shortName = "shortName?";
    obj.position = capture.node.range.start;
    obj.tag = "Variable";
    obj.icon = "icon-code";

    results.push(obj);
  }

  return results;
}
