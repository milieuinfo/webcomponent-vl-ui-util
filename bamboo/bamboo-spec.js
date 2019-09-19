const yaml = require('yaml');
const utils = require('./utils/util');

const YamlSeq = require('yaml/types')('YamlSeq');
const Docu = require('yaml/types')('Document');

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

const specNode = yaml.createNode(spec);
const permissionNode = yaml.createNode(permissions);
const doc = new Docu();
doc.contents = new YamlSeq();
doc.contents.items = [ specNode, permissionNode ]

utils.writeYaml(yaml.stringify(doc), '../../bamboo-specs/out.yml');
utils.writeYaml(yaml.stringify(spec), '../../bamboo-specs/bamboo.yml');
utils.writeYaml(yaml.stringify(permissions), '../../bamboo-specs/permissions.yml');
