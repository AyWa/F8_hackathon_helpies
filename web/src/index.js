import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { Router, Route } from 'react-router-dom';
import createHistory from 'history/createBrowserHistory';
import ScrollToTop from './utils/ScrollToTop';
import 'antd/dist/antd.css';
import './App.css';


ReactDOM.render(
  <Router history={createHistory()}>
    <ScrollToTop>
      <Route path="/" component={App}/>
    </ScrollToTop>
  </Router>,
  document.getElementById('root')
);
registerServiceWorker();
