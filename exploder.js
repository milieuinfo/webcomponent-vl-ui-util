let fs = require('fs');
let es = require('event-stream');
let argv = require('yargs').argv

if (!argv.file || !argv.basePath) {
    process.exit(1);
}

explodeCss(argv.file, argv.basePath);

function explodeCss(file, basePath) {
	const regex = new RegExp('.*style\.css(\'|");$');
	const tempFile = file + '.temp';
	const output = fs.createWriteStream(tempFile, { encoding: 'utf-8' });
	const stream = fs.createReadStream(file)
	.pipe(es.split())
	.pipe(es.mapSync((line) => {
		stream.pause();
		
		if (regex.test(line)) {
			let filePath = sanitizeFilepath(line);
			let style = fs.readFileSync(basePath  + '/' + filePath);
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
		deleteFile(file);
		rename(tempFile, file);
	})
	);
}

function sanitizeFilepath(input) {
    return ['@import', '\'', '\"', ';'].reduce((input, splitter) => {
        return input.split(splitter).join('');
    }, input).trim();
}

function deleteFile(file) {
    if (fs.existsSync(file)) {
        fs.unlinkSync(file, (err) => {
            if (err) throw err;
        });
    }
}

function rename(srcFile, destFile) {
    fs.renameSync(srcFile, destFile, () => {
    });
}

