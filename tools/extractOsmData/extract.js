#!/usr/bin/env node
const Parser = require('./parseToJson');
const spawn = require('child_process').spawn;

// osmosis --read-xml ireland-and-northern-ireland-latest.osm --bounding-box top=54.633661 left=-5.972443 right=-5.870819 bottom=54.554096 --tf accept-nodes amenity=restaurant --write-xml belfast_restaurant.osm

console.log(process.argv[2]);

const test1 = {
  output: './out.js',
  parse: true,
  bbox: {
    top: 54.633661,
    left: -5.972443,
    right: -5.870819,
    bottom: 54.554096,
  },
  accept: {
    nodes: {
      amenity: ['pub', 'bar'],
      shop: '*',
    }
  }
};


function buildCommand(config) {
  let cmd = `--read-xml ${process.argv[2]} `;
  if (config.bbox) {
    cmd += `--bounding-box top=${config.bbox.top} left=${config.bbox.left} right=${config.bbox.right} bottom=${config.bbox.bottom} `;
  }
  if (config.accept) {
    cmd += '--tf ';
    cmd += Object.keys(config.accept).map(type => {
      return `accept-${type}` + Object.keys(config.accept[type]).map(searchKey => {
        let values = config.accept[type][searchKey];
        if (typeof values === 'array') {
          values = values.join(',');
        }
        return ` ${searchKey}=${values} `;
      }).join(' ');
    }).join(' ');
    
  }
  if (config.parse) {
    cmd += `  --write-xml -`;
  } else {
    cmd += `  --write-xml ${config.output}`;
  }
  return cmd;
}

const parameters = buildCommand(test1).split(" ").filter(param => param !== '');

console.log(parameters.join(' '));
const ls = spawn('osmosis', parameters);

if (test1.parse) {
  const parser = new Parser(test1.output);
  parser.fromStream(ls.stdout);
}
ls.stderr.on('data', (data) => {
  console.log(`stderr: ${data}`);
});

ls.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});

/* Kill spawn process before beeing kill */
function exitHandler() {
    ls.stdin.pause();
    ls.kill(); 
    process.exit();
}


//catches ctrl+c event
process.on('SIGINT', exitHandler);

//catches uncaught exceptions
process.on('uncaughtException', exitHandler);