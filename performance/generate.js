const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');
const argv = require('yargs').argv;
const package = require('../../../package.json');

if(!argv.iterations) {
    console.error('Please define the number of iterations via command-line (--iterations=xxx).');
    process.exit(1);
}

const componentName = package.name.split('vl-ui-')[1];

JSDOM.fromFile(path.join(__dirname, `../../../demo/vl-${componentName}.html`)).then(dom => {
    const scripts = [];
    dom.window.document.querySelectorAll('script[type="module"]').forEach(s => scripts.push(s.outerHTML));

    const stylesheets = [];
    dom.window.document.querySelectorAll('link[rel="stylesheet"]').forEach(s => stylesheets.push(s.outerHTML));

    const demo = dom.window.document.querySelectorAll('.demo')[0].outerHTML;
    let demoMultiplied = '';
    for (i = 0; i < argv.iterations; i++) {
        demoMultiplied += demo;
    }

    const html = `<html><head>${scripts.join('')}${stylesheets.join('')}</head><body>${demoMultiplied}</body></html>`;

    fs.writeFileSync(path.join(__dirname, '../../../demo/performance.html'), html, 'utf8', (err) => {
        if (err) throw err;
    });
});
