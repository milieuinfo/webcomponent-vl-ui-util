const http = require('http');

module.exports = async function (context, commands) {

    const hostname = 'demo';
    const port = '8080';
    const path = 'demo/performance.html';

    return new Promise(resolve => {
        function poll() {
            setTimeout(async () => {
                http.get(`http://${hostname}:${port}`, async (res) => {
                    const { statusCode } = res;
                    if (statusCode === 200) {
                        try {
                            context.log.info(`App available on ${hostname}:${port}.`);
                            await commands.navigate(`http://${hostname}:${port}/${path}`);
                            const demoComponents = await commands.js.run('return document.querySelectorAll(".demo").length > 0');
                            if (demoComponents) {
                                resolve();
                            } else {
                                throw e;
                            }
                        } catch (e){
                            throw e;
                        }
                    } else {
                        poll();
                    }
                }).on('error', () => {
                    context.log.error(`App not yet available on ${hostname}:${port}.`);
                    poll();
                });
            }, 5000);
        }

        poll();
    });
}
