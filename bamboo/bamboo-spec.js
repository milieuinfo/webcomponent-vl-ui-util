const yaml = require('js-yaml')
const fs = require('fs');
const package = require('../../../package.json');
const options = { lineWidth: 200 }

const key = "WEBCOM"
const planName = package.name
const planKey = package.name.replace(/-/g, '').toUpperCase();

const content = {
    "project":
    {
        "key": key,
        "plan":
        {
            "name": planName,
            "key": planKey
        }
    },
    "stages": [{
        "jobs": [{
            "scripts": [
                "/opt/scripts/git/git-repository-information-restore.sh",
                "cp ${bamboo.gitconfig_path} ${bamboo.build.working.directory}",
                "cp ${bamboo.npmrc_path} ${bamboo.build.working.directory}",
                "cp ${bamboo.gitcredentials_path} ${bamboo.build.working.directory}",
                "docker build --build-arg VERSION=patch --build-arg REPO=${bamboo.planRepository.repositoryUrl} --no-cache .",
                "/opt/scripts/docker/stop-docker-containers.sh"
            ], "requirements": ["REMOTE_ONLY"]
        }]
    }]
}

const yamlFile = yaml.safeDump(content, options);

fs.mkdir('../../bamboo-specs', { recursive: true }, (err) => {
    if (err) throw err;
    fs.writeFile('../../bamboo-specs/bamboo.yml', yamlFile, 'utf8', (err) => {
        if (err) throw err;
    });
});
