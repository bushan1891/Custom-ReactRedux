import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import reduxThunk from 'redux-thunk';
import logger from 'redux-logger';
import createSagaMiddleware from 'redux-saga'

import App from './components/app';
import Signin from './components/auth/signin';
import Signout from './components/auth/signout';
import Signup from './components/auth/signup';
import Feature from './components/feature';
import Table from './components/Table/table_index';
import SideBar from './components/Table/sidebar/sidebar';
import CreateTable from './components/Table/createtable/create_table'
import ViewTable from './components/Table/viewtable/viewtable';
import EditTable from './components/Table/viewtable/edittable/edittable';
import EditWrapper from './components/Table/viewtable/edittable/editwrapper';
import Cart_Index from './components/Cart/cart_index';

import RequireAuth from './components/auth/require_auth';

import Auth0_lock from './components/auth/auth0_login';


import reducers from './reducers';
import { Router , Route , IndexRoute , browserHistory } from 'react-router';
import {AUTH_USER} from './actions/types';
import {Config} from './sagas/rootsaga.js';
import {postTable , cart} from './components/table/table_sagas';

const sagaMiddleware = createSagaMiddleware()
const createStoreWithMiddleware = applyMiddleware(sagaMiddleware,reduxThunk,logger())(createStore);


const store = createStoreWithMiddleware(reducers);

// run sagas 
sagaMiddleware.run(Config);
sagaMiddleware.run(postTable);
sagaMiddleware.run(cart);



const token = localStorage.getItem('token');
// if token is present log back in 
if(token){
store.dispatch({type:AUTH_USER});

}

// dispatch boot up actions
store.dispatch({type:'CONFIG'});

ReactDOM.render(
  <Provider store={store}>

    <Router history ={browserHistory} >
      <Route path ="/" component = {App} >
        <Route path="/signin" component ={Signin} />
        <Route path="/signout" component ={Signout} />
        <Route path="/signup" component ={Signup} />
        <Route path="/table" component ={Table} >
          <Route path="/table/create" component= {CreateTable}/>
          <Route path="/table/view" component= {ViewTable}/>
          <Route path="/table/view/:id" component = {EditWrapper} />
          <Route path="/cart" component ={Cart_Index} />
        </Route>
		<Route path="/feature" component={RequireAuth(Feature)}/>
      </Route>
  </Router>
  </Provider>
  , document.querySelector('.containerApp'));







