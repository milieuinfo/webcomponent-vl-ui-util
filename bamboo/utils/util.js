const fs = require('fs');
const yaml = require('yaml');
const package = require('../../../../package.json');

function writeYaml(input, output) {
    fs.writeFileSync(output, input, (err) => {
        if (err) throw err;
        console.log('YAML has been saved to ' + output);
    });
};

function getPackageName() {
    return package.name;
}

function getPlanKey() {
    return getPackageName().split('-').join('').toLocaleUpperCase();
}

function parseTemplate(file) {
    console.log(__dirname)
    console.log(process.cwd())
    const file = fs.readFileSync(file, 'utf8', (err) => {
        if (err) throw err;
        console.debug('Parsing ' + file + ' ...');
    });
    return yaml.parseDocument(file);
}

function getSpec() {
    return parseTemplate('../templates/spec-template.yml').contents;
}

function getPermissions() {
    return parseTemplate('../templates/permissions-template.yml').contents;
}

module.exports = { writeYaml, getPackageName, getPlanKey, getSpec, getPermissions }
