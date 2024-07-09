const fs = require('fs');
const path = require('path');

module.exports = function() {
  const notationsDir = path.join(__dirname, 'notations');
  console.log('Notations directory:', notationsDir);
  
  const notationFiles = fs.readdirSync(notationsDir);
  console.log('Notation files found:', notationFiles);
  
  const result = notationFiles.reduce((notations, file) => {
    if (file.endsWith('.json')) {
      const filePath = path.join(notationsDir, file);
      console.log('Processing file:', filePath);
      const content = fs.readFileSync(filePath, 'utf8');
      const notation = JSON.parse(content);
      notations[path.parse(file).name] = notation;
      console.log('Added notation:', path.parse(file).name);
    }
    return notations;
  }, {});

  console.log('Final notations object:', result);
  return result;
};