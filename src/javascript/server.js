// Utils
const path = require('path');
const d = require('debug');

// Express
const express = require('express');
const compression = require('compression');

const debug = d('Server');
const server = express();
server.use(compression());
server.use('/', express.static(path.resolve('./build')));

server.use('/', (req, res) => {
    res.sendFile(path.resolve('./build/index.html'));
});

const port = process.env.PORT || 3000;
const instance = server.listen(port, () => {
    debug(`Listening on port ${port}`);

    process.on('SIGTERM', () => {
        debug('Received SIGTERM, shutting down');

        instance.close(() => {
            debug('Server stopped successfully');
            process.exit(0);
        });

        setTimeout(() => {
            debug('Server didn\'t stop in top, terminating');
            process.exit(0);
        }, 9.9 * 1000);
    });
});
