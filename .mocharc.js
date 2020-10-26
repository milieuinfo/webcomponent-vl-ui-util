module.exports = {
    "full-trace": true,
    "reporter": "mocha-junit-reporter",
    "reporterOptions": {
        "mochaFile": '../../test/e2e.xml'
    },
    "spec": ["../../test/**/*.test.js"],
    "timeout": '10000'
};
