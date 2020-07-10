const fs = require('fs');

(async function() {
  const packageJson = await fs.promises.readFile(path.join(__dirname, '../../package.json'));
  console.log('Package JSON: ' + packageJson)
})();
