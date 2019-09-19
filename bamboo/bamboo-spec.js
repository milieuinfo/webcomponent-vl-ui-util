const yaml = require('yaml');
const utils = require('./utils/util');

const planProjectKey = 'WEBCOM';
const packageName = utils.getPackageName();
const planKey = utils.getPlanKey();
const planName = 'webcomponent-' + packageName;

const spec = utils.getSpec();
const permissions = utils.getPermissions();
const plan = spec.get('plan');

plan.set('project-key', planProjectKey);
plan.set('key', planKey);
plan.set('name', planName);

permissions.get('plan').set('key', planKey);

utils.writeYaml(yaml.stringify(spec), '../../bamboo-specs/bamboo.yml');
utils.writeYaml(yaml.stringify(permissions), '../../bamboo-specs/permissions.yml');
