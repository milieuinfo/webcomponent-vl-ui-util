const execSync = require('child_process').execSync;
const path = process.argv[2];
const webcomponent = process.argv[3];

class WebComponentBuild {
	constructor(path, webcomponent) {
		this.path = path;
		this.webcomponent = webcomponent;
	}

	execute() {
		this.__buildEs6();
		this.__buildEs6Min();
		this.__buildNode();
		this.__commit();
	}

	__buildEs6() {
		const es6BuildFile = `${this.path}/vl-${this.webcomponent}.js`;
		this.__copySrcTo(es6BuildFile);
		this.__maakStyleImportAbsoluut(es6BuildFile);
		this.__maakDistImportsAbsoluut(es6BuildFile);
		this.__maakSrcImportsAbsoluut(es6BuildFile);
	}
	
	__buildEs6Min() {
		const es6MinBuildFile = `${this.path}/vl-${this.webcomponent}.min.js`;
		this.__copySrcTo(es6MinBuildFile);
		this.__maakDistImportsAbsoluut(es6MinBuildFile);
		this.__maakSrcImportsAbsoluut(es6MinBuildFile);
		this.__inlineCss(es6MinBuildFile);
		this.__minify(es6MinBuildFile);
	}

	__buildNode() {
		const nodeBuildFile = `${this.path}/vl-${this.webcomponent}.src.js`;
		this.__copySrcTo(nodeBuildFile);
		this.__vervangWebcomponentenImportsDoorCommonJsImports(nodeBuildFile);
		this.__vervangThidPartyImportsDoorCommonJsImports(nodeBuildFile);
		this.__vervangLocalDistImportsDoorCommonJsImports(nodeBuildFile);
		this.__vervangLocalSrcImportsDoorCommonJsImports(nodeBuildFile);
		this.__inlineCss(nodeBuildFile);
	}
	
	__copySrcTo(destFile) {
		executeCommand(`cp -R -f ${this.path}/src/*.src.js ${destFile}`);
	}
	
	__inlineCss(file) {
		executeCommand(`npm run explode -- --file=${file} --basePath=${this.path}`);
	}
	
	__minify(file) {
		const tmpFile = `${file}.tmp`;
		const script = `minify ${file} > ${tmpFile} && cp ${tmpFile} ${file} && rm -rf ${tmpFile}`;
		executeCommand(script);
	}
	
	__maakStyleImportAbsoluut(file) {
		replace(`${quoted('/style.css')}`, `'/node_modules/vl-ui-${this.webcomponent}/style.css'`, file);
	}
	
	__maakDistImportsAbsoluut(file) {
		replace(`import ${quoted('/dist/(.*)')}`, `import '/node_modules/vl-ui-${this.webcomponent}/dist/\\$1'`, file);
	}

	__maakSrcImportsAbsoluut(file) {
		replace(`from ${quoted('/src/(.*)')}`, `from '/node_modules/vl-ui-${this.webcomponent}/src/\\$1'`, file);
	}

	__vervangWebcomponentenImportsDoorCommonJsImports(file) {
		replace(`'/node_modules/vl-ui-(.*)/vl-(.*).js'`, `'vl-ui-\\$1'`, file);
	}
	
	__vervangThidPartyImportsDoorCommonJsImports(file) {
		replace(`'/node_modules/(.+\\.js)'`, `'\\$1'`, file);
	}
	
	__vervangLocalDistImportsDoorCommonJsImports(file) {
		replace(`import ${quoted('/dist/(.*)')}`, `import 'vl-ui-${this.webcomponent}/dist/\\$1'`, file);
	}
	
	__vervangLocalSrcImportsDoorCommonJsImports(file) {
		replace(`from ${quoted('/src/(.*)')}`, `from 'vl-ui-${this.webcomponent}/src/\\$1'`, file);
	}

	__commit() {
		var gitCommand = `git --git-dir=${this.path}/.git --work-tree=${this.path}`;
		executeCommand(`${gitCommand} add -f vl-*`);
		executeCommand(`${gitCommand} commit --amend --no-edit`);
		executeCommand(`${gitCommand} pull`);
	}
	
}

function executeCommand(script) {
	execSync(script, {stdio: 'inherit'});
}

function replace(search, replacement, file) {
	executeCommand(`replace "${search}" "${replacement}" ${file}`);
}

function quoted(string) {
	return `['\\\"]${string}['\\\"]`;
}

new WebComponentBuild(path, webcomponent).execute();
