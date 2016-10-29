const fs = require('fs');
const XmlStream = require('xml-stream');
const parseNode = require('./parseNode');

class Parser {
  constructor(outputPath, onEnd=() => null) {
    this.output = fs.createWriteStream(outputPath);
    this.startedWriting = false;
    this.onEnd = onEnd;
    
    this.documentsParsed = 0;
  }

  fromFile(inputFile) {
    const input=fs.createReadStream(inputFile);
    this._start(input);
  }
  _start(input) {
    this.documentsParsed = 0;
    this.output.write("[\n");
    const xml = new XmlStream(input);
    xml.preserve('node', true);
    xml.collect('subitem');
    xml.on('endElement: node', node => {
      if (!node.$children) return;
      this._write(node);
    });
    xml.on('end', () => {
      this._end();
    })
  }
  _write(node) {
    const parsedNode = parseNode(node);
    if (this.startedWriting) {
      this.output.write(',\n');
    } else {
      this.startedWriting = true;
    }
    this.documentsParsed++;
    this.output.write(JSON.stringify(parsedNode, null, 2));
  }
  _end() {
    this.output.write("\n]\n");
    this.output.end();
    console.log(`Parsed ${this.documentsParsed}`);
    this.onEnd();
  }
}

module.exports = Parser;