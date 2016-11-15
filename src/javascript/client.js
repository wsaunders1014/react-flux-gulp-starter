import d from 'debug';
import React from 'react';
import { render } from 'react-dom';
import { browserHistory } from 'react-router';
import app from './app';
import Root from './Root';

const debug = d('App');

window.App = window.App || {};

if (window.App.env !== 'production') {
    d.enable('App, Fluxible, Fluxible:*');
}

debug('Rehydrating...');

function init(context) {
    const props = {
        context: context.getComponentContext(),
        history: browserHistory,
    };

    render(<Root {...props} />, document.getElementById('app'));
}

app.rehydrate(window.App, (err, context) => {

    if (err) {
        throw err;
    }

    debug('React Rendering');
    init(context);

    if (module.hot) {
      /**
       * Warning from React Router, caused by react-hot-loader.
       * The warning can be safely ignored, so filter it from the console.
       * Otherwise you'll see it every time something changes.
       * See https://github.com/gaearon/react-hot-loader/issues/298
       */
        // const orgError = console.error; // eslint-disable-line no-console
        // console.error = (message) => { // eslint-disable-line no-console
        //     if (message && message.indexOf('You cannot change <Router routes>;') === -1) {
        //         // Log the error as normally
        //         orgError.apply(console, [message]);
        //     }
        // };

        module.hot.accept('./Root', () => {
            // If you use Webpack 2 in ES modules mode, you can
            // use <App /> here rather than require() a <NextApp />.
            // const NextApp = require('./Root').default;

            console.log('reRender!');

            // console.log(NextApp);

            init(context);
        });
    }
});
