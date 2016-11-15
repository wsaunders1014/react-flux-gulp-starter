import Fluxible from 'fluxible';
import { PropTypes } from 'react';
import ApplicationStore from 'stores/ApplicationStore';

import assetUrl from 'libs/assetUrl';

const app = new Fluxible();

app.plug(assetUrl);

app.customContexts = {
    assetUrl: PropTypes.func.isRequired,
    siteUrl: PropTypes.func.isRequired,
};

app.registerStore(ApplicationStore);

export default app;
