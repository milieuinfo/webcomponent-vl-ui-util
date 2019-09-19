const yaml = require('yaml');
const utils = require('./utils/util');
const Document = require('yaml')(Document);
const YamlSeq = require('yaml')(YamlSeq);

const planProjectKey = 'WEBCO';
const packageName = utils.getPackageName();
const packageName = 'vl-ui-checkbox';
const planKey = utils.getPlanKey();
const planKey = 'ABC';
const planName = 'webcomponent-' + packageName;

const spec = utils.getSpec();
const permissions = utils.getPermissions();
const plan = spec.get('plan');

plan.set('project-key', planProjectKey);
plan.set('key', planKey);
plan.set('name', planName);

permissions.get('plan').set('key', planKey);

const specNode = yaml.createNode(spec);
const permissionNode = yaml.createNode(permissions);
const doc = new Document();
doc.contents = new YamlSeq();
doc.contents.items = [ specNode, permissionNode ]

utils.writeYaml(yaml.stringify(doc), '../../bamboo-specs/out.yml');
utils.writeYaml(yaml.stringify(spec), '../../bamboo-specs/bamboo.yml');
utils.writeYaml(yaml.stringify(permissions), '../../bamboo-specs/permissions.yml');
