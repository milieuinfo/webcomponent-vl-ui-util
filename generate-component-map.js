const github = require('octonode');

const githubClient = github.client();

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

async function getWebcomponenten() {
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
        .filter(repo => /^webcomponent-vl-ui/.test(repo.name))
        .map(repo => githubClient.repo(repo.full_name));
}

async function packageJsonOfWebcomponent(webcomponent) {
    const packageJsonContentEntity = await webcomponent.contentsAsync('package.json');
    if (packageJsonContentEntity && packageJsonContentEntity.length > 0 && packageJsonContentEntity[0].content) {
        const packageJsonContent = Buffer.from(packageJsonContentEntity[0].content, packageJsonContentEntity[0].encoding).toString('utf-8');
        return JSON.parse(packageJsonContent);
    }
}

function onlyVlDependencies(dependencies) {
    return Object.keys(dependencies).filter(dependency => dependency.startsWith("vl-") && dependency !== "vl-ui-core");
}

function dependenciesAsGraph(componentName, dependencies) {
    return dependencies.map(dependency => `"${componentName}" -> "${dependency}"`);
}

function printVlDependencies(componentName, dependencies, exclusions) {
    const filteredDependencies = onlyVlDependencies(dependencies || [])
        .filter(dependency => !exclusions.includes(dependency));
    dependenciesAsGraph(componentName, filteredDependencies).forEach(d => console.log(d));
}

async function printGraph(options) {
    const webcomponenten = await getWebcomponenten();
    for (let i = 0; i < webcomponenten.length; i++) {
        const packageJson = await packageJsonOfWebcomponent(webcomponenten[i]);
        if (packageJson) {
            const componentName = packageJson.name;

            if (!options.exclusions.includes(componentName)) {
                if (options.dependencies) {
                    printVlDependencies(componentName, packageJson.dependencies, options.exclusions);
                }

                if (options.devDependencies) {
                    printVlDependencies(componentName, packageJson.devDependencies, options.exclusions);
                }
            }
        }
    }
}

return printGraph(options()).catch(error => console.error(error));