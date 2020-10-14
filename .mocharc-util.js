module.exports = {
    "full-trace": true,
    "reporter": 'mocha-multi-reporters',
    "reporter-option": {
        "configFile": 'reporter-config.json'
    },
    "spec": ["test/**/*.test.js"],
    "timeout": '10000'
};
