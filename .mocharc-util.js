module.exports = {
    "full-trace": true,
    "reporter": 'mocha-multi-reporters',
    "reporterOptions": {
        "configFile": 'reporter-config-util.json'
    },
    "spec": ["test/**/*.test.js"],
    "timeout": '10000'
};