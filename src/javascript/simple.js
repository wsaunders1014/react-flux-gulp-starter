import d from 'debug';
import polyfill from 'babel-polyfill'; // eslint-disable-line no-unused-vars

import React from 'react';
import { render } from 'react-dom';
import { browserHistory } from 'react-router';
import { AppContainer } from 'react-hot-loader';
import fetchRouteData from 'utils/fetchRouteData';
import app from './app';
import Root from './Root';

const debug = d('App');

window.App = window.App || {};

if (window.App.env !== 'production') {
    d.enable('App, Fluxible, Fluxible:*');
}

debug('Rehydrating...');

app.rehydrate(window.App, (err, context) => {
    if (err) {
        throw err;
    }
    debug('React Rendering');
    const rootEl = document.getElementById('app');
    let isRehydrating = true;

    function onUpdate() {
        if (isRehydrating) {
            isRehydrating = false;
            return;
        }
        fetchRouteData(context, this.state)
            .then(() => { /* emit an event? */ })
            .catch(fetchDataErr => {
                console.error(fetchDataErr.stack);
            });
    }

    const renderProps = {
        context: context.getComponentContext(),
        history: browserHistory,
        onUpdate,
    };

    render(
        <AppContainer>
            <Root {...renderProps}/>
        </AppContainer>,
        rootEl
    );

    if (module.hot) {
        console.log('module.hot enabled', module.hot);
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
            render(
                <AppContainer>
                    <Root {...renderProps}/>
                </AppContainer>,
                rootEl
            );
        });
    }


});
