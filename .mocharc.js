module.exports = {
    "full-trace": true,
    "reporter": 'xunit',
    "reporter-option": [
        'output=../../test/results/results.xml'
    ],
    "spec": ["../../test/**/*.test.js"],
    "timeout": '10000'
};
