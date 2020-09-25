const fs = require('fs/promises');
const path = require('path');

async function copyTemplate() {
    return fs.copyFile(path.join('..', 'templates', 'README.md.template'), README.md.template);
}