module.exports = {
    "full-trace": true,
    "reporter": 'xunit',
    "reporter-option": {
        "output": "results.xml"
    },
    "spec": ["../../test/**/*.test.js"],
    "timeout": '10000'
};
