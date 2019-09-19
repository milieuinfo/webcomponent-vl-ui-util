const YAML = require('yaml');
const Document = YAML.Document;
const utils = require('./utils/util');

const planProjectKey = 'WEBCO';
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

const specNode = YAML.createNode(spec);
const permissionNode = YAML.createNode(permissions);

const doc = new Document();
doc.contents = new YAML.YAMLSeq();

doc.contents.items = [ specNode, permissionNode ]

utils.writeYaml(YAML.stringify(doc), '../../bamboo-specs/out.yml');
utils.writeYaml(YAML.stringify(spec), '../../bamboo-specs/bamboo.yml');
utils.writeYaml(YAML.stringify(permissions), '../../bamboo-specs/permissions.yml');
