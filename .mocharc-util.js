module.exports = {
    "full-trace": true,
    "reporter": 'xunit',
    "reporter-option": [
        'output=../../test/util-results.xml'
    ],
    "spec": ["test/**/*.test.js"],
    "timeout": '10000'
};
