const fs = require('fs');
const path = require('path');

module.exports = function() {
  const notationsDir = __dirname + '/notations';
  const notationFiles = fs.readdirSync(notationsDir);
  
  return notationFiles.reduce((notations, file) => {
    const content = fs.readFileSync(path.join(notationsDir, file), 'utf8');
    const notation = JSON.parse(content);
    notations[path.parse(file).name] = notation;
    return notations;
  }, {});
};