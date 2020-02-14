let fs = require('fs');
let es = require('event-stream');
let argv = require('yargs').argv

if (!fileNameParameterExists()) {
    process.exit(1);
}

const regex = new RegExp('.*style\.css(\'|");$');
let output = fs.createWriteStream(getTempFilePath(), { encoding: 'utf-8' });
let stream = fs.createReadStream(getFilePath())
    .pipe(es.split())
    .pipe(es.mapSync((line) => {
        stream.pause();

        if (regex.test(line)) {
            let filePath = sanitizeFilepath(line);
            let style = fs.readFileSync('../..' + filePath);
            output.write(style + '\r\n');
        } else {
            output.write(line + '\r\n');
        }

        stream.resume();
    })
        .on('error', (err) => {
            console.log('Something went wrong.', err);
        })
        .on('end', () => {
            output.end();
            cleanup();
        })
    );

function sanitizeFilepath(input) {
    return ['@import', '\'', '\"', ';'].reduce((input, splitter) => {
        return input.split(splitter).join('');
    }, input).trim();
}

function getFileName() {
    return argv.fileName;
}

function getFilePath() {
    return '../../' + getFileName();
}

function getTempFilePath() {
    return '../../' + getFileName() + '.temp';
}

function deleteSource() {
    if (fs.existsSync(getFilePath())) {
        fs.unlinkSync(getFilePath(), (err) => {
            if (err) throw err;
        });
    }
}

function fileNameParameterExists() {
    return argv.fileName;
}

function renameTempFile() {
    fs.renameSync(getTempFilePath(), getFilePath(), () => {
    });
}

function cleanup() {
    deleteSource();
    renameTempFile();
}
