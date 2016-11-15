require('source-map-support').install();
// Utils
const _ = require('lodash');
const path = require('path');
const d = require('debug');

// Express
const express = require('express');
const expressState = require('express-state');
const compression = require('compression');

// React / App-level
const React = require('react');
const ReactDOMServer = require('react-dom/server');
const { provideContext } = require('fluxible-addons-react');
const app = require('./app').default;
const Html = require('components/Html.jsx').default;

// Routing
const { RouterContext, match } = require('react-router');
const routes = require('./routes.jsx').default;
const { createMemoryHistory } = require('react-router');

// Middleware
const fetchRouteData = require('utils/fetchRouteData').default;

const debug = d('Server');

const server = express();

expressState.extend(server);

server.use(compression());

const port = process.env.PORT || 3000;

module.exports = function(devServer = () => {}) {
    devServer(server);

    server.use('/', express.static(path.resolve('./build/client')));

    server.use((req, res) => {
        const location = createMemoryHistory().createLocation(req.url);

        const context = app.createContext({
            env: process.env.NODE_ENV || 'local',
            siteUrl: process.env.SITE_URL || `${req.protocol}://${req.hostname}`,
            // Uncomment this code to specify where on S3 remote assets are stored
            // aws: {
            //     useS3: process.env.USE_S3 && process.env.USE_S3 !== 'false' || false,
            //     bucket: process.env.S3_BUCKET || 'madeinhaus',
            //     prefix: process.env.S3_PREFIX || 'react-flux-gulp-starter',
            //     folder: process.env.S3_PATH || process.env.NODE_ENV || false,
            //     urlHash: process.env.URL_HASH || false,
            //     cloudfront: process.env.CLOUDFRONT_URL || false,
            //     bypassCdn: req.query.bypass || false,
            // },
        });

        match({ routes, location }, (error, redirectLocation, renderProps) => {
            if (redirectLocation) {
                res.redirect(301, redirectLocation.pathname + redirectLocation.search);
            } else if (error) {
                res.status(500).send(error.message);
            } else {
                if (_.last(renderProps.routes).isNotFound) {
                    res.status(404);
                }
                fetchRouteData(context, renderProps)
                    .then(() => {
                        const appState = app.dehydrate(context);
                        appState.env = process.env.NODE_ENV || 'local';
                        res.expose(appState, 'App');

                        const props = Object.assign(
                                            {},
                                            renderProps,
                            {
                                context: context.getComponentContext(),
                                key: Date.now(),
                            }
                                        );

                        const RouterComponent = provideContext(RouterContext, app.customContexts);
                        const HtmlComponent = provideContext(Html, app.customContexts);

                        const html =
                            ReactDOMServer.renderToStaticMarkup(
                                React.createElement(HtmlComponent, {
                                    title: 'react-flux-gulp-starter - madeinhaus.com',
                                    context: context.getComponentContext(),
                                    state: res.locals.state,
                                    children: [React.createElement(RouterComponent, props)],
                                    location,
                                }
                            ));
                        res.send(`<!DOCTYPE html>${html}`);
                    })
                    .catch(err => {
                        res.status(500).send(err.stack);
                    });
            }
        });
    });

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

};
