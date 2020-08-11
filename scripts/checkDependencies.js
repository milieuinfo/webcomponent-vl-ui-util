const data = require('../../../package.json');

class Dependencies {
  execute(data) {
    const dependencies = data.dependencies;
    const devDependencies = data.devDependencies;
    const peerDependencies = data.peerDependencies;

    const errors = this.testVersionNumbersAgainstRegex(dependencies) +
      this.testVersionNumbersAgainstRegex(devDependencies) +
      this.testVersionNumbersAgainstRegex(peerDependencies);

    this.processErrors(errors);
  }

  processErrors(errors) {
    if (errors > 0) {
      throw new Error('Een of meerdere dependencies verwijzen naar een branch!');
    }
  }

  testVersionNumbersAgainstRegex(dependencies) {
    const regex = /(\^|\~)?\d{1,3}\.\d{1,3}\.\d{1,3}/;

    let errors = 0;
    if (typeof dependencies != 'undefined') {
      Object.entries(dependencies).forEach(([dep, version]) => {
        if (!regex.test(version)) {
          errors++;
          console.error(`Ongeldige versienummer voor ${dep}: ${version}`);
        }
      });
    }
    return errors;
  }
}

module.exports = Dependencies;

new Dependencies().execute(data);
