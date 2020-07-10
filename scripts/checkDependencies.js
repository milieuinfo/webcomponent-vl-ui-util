const fs = require('fs');
const path = require('path');

(async function() {
  const packageJson = await fs.promises.readFile(path.join(__dirname, '../../package.json'));
  console.log('Package JSON: ' + packageJson)
})();
