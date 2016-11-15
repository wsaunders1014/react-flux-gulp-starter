if (typeof require.ensure !== 'function') require.ensure = (d, c) => c(require);
import React from 'react';
import Application from 'components/Application';
import Home from 'components/Home';
import { Route, IndexRoute } from 'react-router';
import NotFound from 'components/NotFound';

const about = (nextState, cb) => {
    require.ensure([], require => {
        cb(null, require('components/About.jsx').default);
    });
}

const contact = (nextState, cb) => {
    require.ensure([], require => {
        cb(null, require('components/Contact.jsx').default);
    });
}

export default (
    <Route path="/" component={Application}>
        <IndexRoute component={Home} />
        <Route path="about" getComponent={about} />
        <Route path="contact" getComponent={contact} />
        <Route path="*" component={NotFound} />
    </Route>
);
