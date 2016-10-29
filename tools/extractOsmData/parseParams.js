
function parse() {
  let params = {}
  for(let i = 0; i < process.argv.length; i++) {
    const param = process.argv[i];
    if(param.startsWith("--")) {
      const next = process.argv[++i];
      if (next && !next.startsWith("--")) {
        params[param] = next;
      } else {
        console.log("invalid value for " + param)
      }
    }
  }
  return params;
}