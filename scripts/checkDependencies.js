const data = require('../../../package.json');

const dependencies = data.dependencies;
const devDependencies = data.devDependencies;
const peerDependencies = data.peerDependencies;

const allDependencies = Object.assign(dependencies, devDependencies, peerDependencies);
const regex = new RegExp('^\D?\d*\.\d*\.\d*$');
let errors = 0;

Object.entries(allDependencies).forEach(([dep, version]) => {
  if (!regex.test(version)) {
    errors++;
    console.error(`Ongeldige versienummer voor ${dep}: ${version}`);
  }
});

if (errors > 0) {
  process.exit(1);
}
