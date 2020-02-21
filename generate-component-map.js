let fs = require('fs');
const basePath = process.argv[2];
let path = require('path');

fs.readdirSync(basePath).forEach(file => {
	if (file.startsWith("webcomponent-vl-")) {
		const componentPath = path.resolve(basePath, file);
		const packageJsonInhoud = fs.readFileSync(path.resolve(componentPath, "package.json"));
		const packageJson = JSON.parse(packageJsonInhoud);
		const componentName = packageJson.name;
		Object.keys(packageJson.dependencies).forEach(dependency => {
			if (dependency.startsWith("vl-") && dependency != "vl-ui-core") {
				console.log(`"${componentName}" -> "${dependency}"`);
			}
		});
	}
});