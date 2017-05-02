import ReduxService from 'ember-redux/services/redux';
import reducers from '../reducers/index';
import enhancers from '../enhancers/index';
import middlewareConfig from '../middleware/index';

export default ReduxService.extend({ reducers, enhancers, middlewareConfig });
