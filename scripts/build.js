const execSync = require('child_process').execSync;
const argv = require('yargs').argv;
const fs = require('fs');
const path = require('path');
const replace = require('replace');
const minify = require('minify');
const basePath = argv._[0];
const webcomponent = argv._[1];
const noCommit = argv._[2] == 'no-commit';

class WebComponentBuild {
  constructor(path, webcomponent) {
    this.path = path;
    this.webcomponent = webcomponent;
    this.srcFolder = `${this.path}/src`;
    this.distFolder = `${this.path}/dist`;
  }

  execute() {
    this.__cleanDistFolder();
    this.__copyNonVlSrcToDist();
    const builds = fs.readdirSync(this.srcFolder).map((file) => {
      if (file.startsWith('vl-')) {
        return this.__build(path.resolve(this.srcFolder, file));
      } else {
        return Promise.resolve();
      }
    });
    return Promise.all(builds).then(() => {
      if (!noCommit) {
        this.__commit();
      }
    });
  }

  __cleanDistFolder() {
    if (fs.existsSync(this.distFolder)) {
      fs.rmdirSync(this.distFolder, {recursive: true});
    }
    fs.mkdirSync(this.distFolder);
  }

  __copyNonVlSrcToDist() {
    copyFilesTo(this.srcFolder, this.distFolder, (file) => !file.startsWith('vl-'));
  }

  async __build(file) {
    this.__buildEs6(file);
    await this.__buildEs6Min(file);
    this.__buildNode(file);
  }

  __buildEs6(file) {
    const es6BuildFile = `${this.distFolder}/${fileNameWithoutExtension(file)}.js`;
    copy(file, es6BuildFile);
    this.__maakStyleImportAbsoluutNaarDist(es6BuildFile);
    this.__maakLibImportsAbsoluut(es6BuildFile);
    this.__maakVlSrcImportsAbsoluut(es6BuildFile);
    this.__maakSrcImportsAbsoluut(es6BuildFile);
  }

  async __buildEs6Min(file) {
    const es6MinBuildFile = `${this.distFolder}/${fileNameWithoutExtension(file)}.min.js`;
    copy(file, es6MinBuildFile);
    this.__vervangGovFlandersImportsDoorMinifiedImports(es6MinBuildFile);
    this.__maakLibImportsAbsoluut(es6MinBuildFile);
    this.__maakVlSrcImportsAbsoluut(es6MinBuildFile);
    this.__maakSrcImportsAbsoluut(es6MinBuildFile);
    this.__vervangWebcomponentenImportsDoorMinifiedImports(es6MinBuildFile);
    this.__inlineCss(es6MinBuildFile);
    this.__maakStyleImportAbsoluutNaarDist(es6MinBuildFile);
    await this.__minify(es6MinBuildFile);
  }

  __buildNode(file) {
    const nodeBuildFile = `${this.distFolder}/${fileNameWithoutExtension(file)}.src.js`;
    copy(file, nodeBuildFile);
    this.__vervangWebcomponentenImportsDoorRelatieveImports(nodeBuildFile);
    this.__vervangThirdPartyImportsDoorRelatieveImports(nodeBuildFile);
    this.__vervangLocalLibImportsDoorRelatieveImports(nodeBuildFile);
    this.__vervangLocalVlSrcImportsDoorRelatieveImports(nodeBuildFile);
    this.__vervangLocalSrcImportsDoorRelatieveImports(nodeBuildFile);
    this.__inlineCss(nodeBuildFile);
    this.__maakStyleImportAbsoluutNaarDist(nodeBuildFile);
  }

  __inlineCss(file) {
    executeCommand(`node ${__dirname}/exploder.js --file=${file} --basePath=${this.path}`);
  }

  async __minify(file) {
    const output = await minify(file);
    fs.writeFileSync(file, output);
  }

  __maakStyleImportAbsoluutNaarDist(file) {
    replaceInFile(`${quoted('/src/style.css')}`, `'/node_modules/vl-ui-${this.webcomponent}/dist/style.css'`, file);
  }

  __maakLibImportsAbsoluut(file) {
    replaceInFile(`import ${quoted('/lib/(.*)')}`, `import '/node_modules/vl-ui-${this.webcomponent}/lib/$1'`, file);
  }

  __maakVlSrcImportsAbsoluut(file) {
    replaceInFile(`${quoted('/src/vl-(.*)')}`, `'/node_modules/vl-ui-${this.webcomponent}/dist/vl-$1'`, file);
  }

  __maakSrcImportsAbsoluut(file) {
    replaceInFile(`${quoted('/src/((?!vl-)(.*)).js')}`, `'/node_modules/vl-ui-${this.webcomponent}/src/$1.js'`, file);
  }

  __vervangWebcomponentenImportsDoorMinifiedImports(file) {
    replaceInFile(`${quoted('/node_modules/vl-ui-(.*)/dist/vl-(.*).js')}`, `'/node_modules/vl-ui-$1/dist/vl-$2.min.js'`, file);
  }

  __vervangGovFlandersImportsDoorMinifiedImports(file) {
    replaceInFile(`${quoted('/node_modules/@govflanders/(.*).js')}`, `'/node_modules/@govflanders/$1.min.js'`, file);
  }

  __vervangWebcomponentenImportsDoorRelatieveImports(file) {
    replaceInFile(`${quoted('/node_modules/vl-ui-(.*)/dist/vl-(.*).js')}`, `'vl-ui-$1'`, file);
  }

  __vervangThirdPartyImportsDoorRelatieveImports(file) {
    replaceInFile(`([import|from].*?)${quoted('/node_modules/(.+\\.js)')}`, `'$1$2'`, file);
  }

  __vervangLocalLibImportsDoorRelatieveImports(file) {
    replaceInFile(`import ${quoted('/lib/(.*)')}`, `import '../lib/$1'`, file);
  }

  __vervangLocalVlSrcImportsDoorRelatieveImports(file) {
    replaceInFile(`${quoted('/src/vl-(.*).js')}`, `'../dist/vl-$1.src.js'`, file);
  }

  __vervangLocalSrcImportsDoorRelatieveImports(file) {
    replaceInFile(`from ${quoted('/src/(.*)')}`, `from '../src/$1'`, file);
  }

  __commit() {
    const gitCommand = `git --git-dir=${this.path}/.git --work-tree=${this.path}`;
    executeCommand(`${gitCommand} add -f ${this.path}/dist/*.*`);
    executeCommand(`${gitCommand} add -f ${this.path}/package-lock.json`);
    executeCommand(`${gitCommand} commit --amend --no-edit`);
    executeCommand(`${gitCommand} pull`);
    executeCommand(`${gitCommand} status`);
  }
}

function executeCommand(script) {
  execSync(script, {stdio: 'inherit'});
}

function replaceInFile(search, replacement, file) {
  replace({
    regex: search,
    replacement: replacement,
    paths: [file],
  });
}

function copy(srcFile, destFile) {
  fs.copyFileSync(srcFile, destFile);
}

function quoted(string) {
  return `['\\\"]${string}['\\\"]`;
}

function copyToFolder(srcFile, destFolder) {
  const destFile = path.resolve(destFolder, path.basename(srcFile));
  copy(srcFile, destFile);
}

function copyFilesTo(srcFolder, destFolder, predicate) {
  fs.readdirSync(srcFolder).forEach((file) => {
    if (!predicate || predicate(file)) {
      const srcFile = path.resolve(srcFolder, file);
      copyToFolder(srcFile, destFolder);
    }
  });
}

function fileNameWithoutExtension(file) {
  return path.parse(path.basename(file)).name;
}

new WebComponentBuild(basePath, webcomponent).execute();
