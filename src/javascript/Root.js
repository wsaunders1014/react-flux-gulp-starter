import React, { PropTypes } from 'react';
import { Router } from 'react-router';
import app from './app';
import { provideContext } from 'fluxible-addons-react';
import routes from './routes';

// If you use React Router, make this component
// render <Router> with your routes. Currently,
// only synchronous routes are hot reloaded, and
// you will see a warning from <Router> on every reload.
// You can ignore this warning. For details, see:
// https://github.com/reactjs/react-router/issues/2182

const Root = ({ context, history }) => {
    const RouterWithContext = provideContext(Router, app.customContexts);
    return <RouterWithContext
                context={context}
                history={history}
                routes={routes} />;
};

// Root.propTypes = {
//     history: PropTypes.object.isRequired,
//     // store: PropTypes.object.isRequired,
// };

Root.propTypes = {
    context: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
};

export default Root;
