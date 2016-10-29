const exec = require('child_process').exec;

// osmosis --read-xml ireland-and-northern-ireland-latest.osm --bounding-box top=54.633661 left=-5.972443 right=-5.870819 bottom=54.554096 --tf accept-nodes amenity=restaurant --write-xml belfast_restaurant.osm

console.log(process.argv[2]);

const test1 = {
  output: './out.osm',
  bbox: {
    top: 54.633661,
    left: -5.972443,
    right: -5.870819,
    bottom: 54.554096,
  },
  accept: {
    nodes: {
      amenity: ['pub', 'bar']
    }
  }
};


function buildCommand(config) {
  let cmd = `osmosis --read-xml ${process.argv[2]} `;
  if (config.bbox) {
    cmd += `--bounding-box top=${config.bbox.top} left=${config.bbox.left} right=${config.bbox.right} bottom=${config.bbox.bottom} `;
  }
  if (config.accept) {
    cmd += '--tf ';
    cmd += Object.keys(config.accept).map(type => {
      return Object.keys(config.accept[type]).map(searchKey => {
        let values = config.accept[type][searchKey];
        if (typeof values === 'array') {
          values = values.join(',');
        }
        return `accept-${type} ${searchKey}=${values} `;
      }).join(' ');
    }).join(' ');
    
  }
  cmd += `  --write-xml ${config.output}`;
  return cmd;
}

const cmd = buildCommand(test1);
console.log(cmd);
exec(cmd, (err, stdout, stderr) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(stdout);
});

