const github = require('octonode');

const githubClient = github.client("????");

function options() {
    const options = {
        dependencies: true,
        devDependencies: true,
        exclusions: []
    };
    const args = process.argv.slice(2);

    args.forEach(arg => {
        switch (arg) {
            case '--no-dependencies':
            case '-nd':
                options.dependencies = false;
                break;
            case '--no-dev-dependencies':
            case '-ndd':
                options.devDependencies = false;
                break;
            default:
                const excludeArgument = '--exclude=';
                if (arg.startsWith(excludeArgument)) {
                    options.exclusions = [...options.exclusions, arg.slice(excludeArgument.length)];
                }
        }
    });

    return options;
}

async function getWebcomponenten(reposFilter) {
    const org = githubClient.org('milieuinfo');
    let repos = [], reposInPage = [];
    let reposPage = 1;

    do {
        reposInPage = await org.reposAsync({page: reposPage});
        reposPage++;

        if (reposInPage && reposInPage.length > 0) {
            repos = [...repos, ...reposInPage[0]];
        }

    } while (reposInPage && reposInPage.length > 0 && reposInPage[0].length > 0);

    return repos
        .filter(reposFilter)
        .map(repo => githubClient.repo(repo.full_name));
}

async function packageJsonOfWebcomponent(webcomponent) {
    const packageJsonContentEntity = await webcomponent.contentsAsync('package.json');
    if (packageJsonContentEntity && packageJsonContentEntity.length > 0 && packageJsonContentEntity[0].content) {
        const packageJsonContent = Buffer.from(packageJsonContentEntity[0].content, packageJsonContentEntity[0].encoding).toString('utf-8');
        return JSON.parse(packageJsonContent);
    }
}

async function printGraph(options) {
	const reposFilter = repo => /^webcomponent-vl-ui/.test(repo.name) && !(/^webcomponent-vl-ui-form/.test(repo.name));
	const dependenciesFilter = dependency => dependency.startsWith("vl-") 
		&& dependency !== "vl-ui-core" && dependency !== 'vl-ui-util' && !options.exclusions.includes(dependency);
	const dependencyLogFunction = (componentName, dependency, version) => { return `"${componentName}" -> "${dependency}" [style=solid]`; };
	const devDependencyLogFunction = (componentName, dependency, version) => { return `"${componentName}" -> "${dependency}" [style=dotted]`; };

    const webcomponenten = await getWebcomponenten(reposFilter);
    for (let i = 0; i < webcomponenten.length; i++) {
        const packageJson = await packageJsonOfWebcomponent(webcomponenten[i]);
        if (packageJson) {
            const componentName = packageJson.name;
               if (options.dependencies) {
                   printVlDependencies(componentName, packageJson.dependencies, dependenciesFilter, dependencyLogFunction);
               }
               if (options.devDependencies) {
                   printVlDependencies(componentName, packageJson.devDependencies, dependenciesFilter, devDependencyLogFunction);
               }
        }
    }
}

function retainKeys(objToFilter, filter) {
	return Object.keys(objToFilter)
	  .filter(filter)
	  .reduce((obj, key) => {
	    obj[key] = objToFilter[key];
	    return obj;
	  }, {});
}

function printVlDependencies(componentName, dependencies, dependenciesFilter, dependencyLogFunction) {
    const filteredDependencies = retainKeys(dependencies || [], dependenciesFilter);
    Object.keys(filteredDependencies).map(dependency => {
    	return dependencyLogFunction(componentName, dependency, filteredDependencies[dependency]);
    }).forEach(line => console.log(line));
}


return printGraph(options()).catch(error => console.error(error));