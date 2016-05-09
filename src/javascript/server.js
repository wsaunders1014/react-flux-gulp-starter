// Utils
import _ from 'lodash';
import path from 'path';
import d from 'debug';

// Express
import express from 'express';
import compression from 'compression';

// React / App-level
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { provideContext } from 'fluxible-addons-react';
import app from './app';
import Html from 'components/Html.jsx';

// Routing
import { RouterContext, match } from 'react-router';
import routes from 'components/Routes.jsx';
import { createMemoryHistory } from 'react-router';

import fetchRouteData from 'utils/fetchRouteData';

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
