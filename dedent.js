"use strict";

function dedent(strings, ...values) {

  let raw;
  if (typeof strings === "string") {
    // dedent can be used as a plain function
    raw = [strings];
  } else {
    raw = strings.raw;
  }

  // first, perform interpolation
  let result = "";
  for (let i = 0; i < raw.length; i++) {
    result += raw[i].
      // join lines when there is a suppressed newline
      replace(/\\\n[ \t]*/g, "").

      // handle escaped backticks
      replace(/\\`/g, "`");

    if (i < values.length) {
      result += values[i];
    }
  }

  // dedent eats leading and trailing whitespace too
  result = result.trim();

  // now strip indentation
  const lines = result.split("\n");
  let mindent = null;
  lines.forEach(l => {
    let m = l.match(/^ +/);
    if (m) {
      let indent = m[0].length;
      if (!mindent) {
        // this is the first indented line
        mindent = indent;
      } else {
        mindent = Math.min(mindent, indent);
      }
    }
  });

  if (mindent !== null) {
    result = lines.map(l => l[0] === " " ? l.slice(mindent) : l).join("\n");
  }

  // handle escaped newlines at the end to ensure they don't get stripped too
  return result.replace(/\\n/g, "\n");
}

if (typeof module !== "undefined") {
  module.exports = dedent;
}
