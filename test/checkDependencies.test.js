const mock = require('mock-require');
mock('../../../package.json', {request: () => { }});

const Dependencies = require('../scripts/checkDependencies');
const {assert, expect} = require('chai');

const mockPackage = {
  'dependencies': {
    'chai': '^4.2.0',
    'selenium-webdriver': '~4.0.0-alpha.7',
    'vl-ui-util': 'github:milieuinfo/webcomponent-vl-ui-util#UIG-123',
    'vl-ui-core': 'github:milieuinfo/webcomponent-vl-ui-core',
    'vl-ui-button': 'milieuinfo/webcomponent-vl-ui-button#UIG-123',
    'vl-ui-accordion': 'milieuinfo/webcomponent-vl-ui-accordion',
  },
};

describe('checkDependencies script', () => {
  it('indien het versienummer niet voldoet aan de regex zal er de error-counter verhogen', () => {
    const errors = new Dependencies().testVersionNumbersAgainstRegex(mockPackage.dependencies);
    assert.isTrue(errors === 4 );
  });

  it('indien er dependencies niet voldoen aan de regex zal de exit code op 1 gezet worden', () => {
    const dependencies = new Dependencies();
    const errors = dependencies.testVersionNumbersAgainstRegex(mockPackage.dependencies);
    expect(() => dependencies.processErrors(errors)).to.throw('Een of meerdere dependencies verwijzen naar een branch!');
  });
});
