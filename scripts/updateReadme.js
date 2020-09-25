const fs = require('fs');
const path = require('path');

function copyTemplate() {
    fs.copyFileSync(path.join('templates', 'README.md.template'), path.join('..', '..', 'README.md'));
}

function getParameters(json) {
    let parameters = {};
    parameters.description = json.description;
    parameters.name = json.name;
    parameters.demoName = parameters.name.replace('ui-', '');
    parameters.apiName = parameters.demoName.charAt(0).toUpperCase() 
        + 'l' 
        + parameters.demoName.charAt(3).toUpperCase() 
        + parameters.demoName.substring(4);
    return parameters;
}

function updateReadme(readme, parameters) {  
    let updatedReadme = readme.replace(/@description@/gm, parameters.description)
        .replace(/@fullName@/gm, parameters.name)
        .replace(/@apiName@/gm, parameters.apiName)
        .replace(/@demoName@/gm, parameters.demoName);
    fs.writeFileSync(path.join('..', '..', 'README.md'), updatedReadme, 'utf-8');
  }
  
copyTemplate();
const json = JSON.parse(fs.readFileSync(path.join('..', '..', 'package.json')));
const parameters = getParameters(json);
const readMe = fs.readFileSync(path.join('..', '..', 'README.md'), 'utf8')
updateReadme(readMe, parameters);