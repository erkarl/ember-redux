import Ember from 'ember';
import redux from 'redux';
import reducers from '../reducers/index';
import enhancers from '../enhancers/index';
import middlewareConfig from '../middleware/index';

const { assert, isArray, get } = Ember;

// Handle "classic" middleware exports (i.e. an array), as well as the hash option
const extractMiddlewareConfig = (mc) => {
  assert(
    'Middleware must either be an array, or a hash containing a `middleware` property',
    isArray(mc) || mc.middleware
  );
  return isArray(mc) ? { middleware: mc } : mc;
}

const { createStore, applyMiddleware, combineReducers, compose } = redux;

const makeStoreInstance = ({middlewareConfig, reducers, enhancers}) => {
  const { middleware, setup = () => {} } = extractMiddlewareConfig(middlewareConfig);
  const createStoreWithMiddleware = compose(applyMiddleware(...middleware), enhancers)(createStore);
  const reducer = typeof reducers === 'function' ? reducers : combineReducers(reducers);
  const store = createStoreWithMiddleware(reducer);
  setup(store);
  return store;
};

export default Ember.Service.extend({
  middlewareConfig,
  reducers,
  enhancers,
  makeStoreInstance,
  init() {
    const enhancers = get(this, 'enhancers');
    const reducers = get(this, 'reducers');
    const middlewareConfig = get(this, 'middlewareConfig');
    this.store = this.makeStoreInstance({ middlewareConfig, reducers, enhancers });
    this._super(...arguments);
  },
  getState() {
    return this.store.getState();
  },
  dispatch(action) {
    return this.store.dispatch(action);
  },
  subscribe(func) {
    return this.store.subscribe(func);
  }
});
