import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from '../../pages/home';
import Album from '../../pages/album';
import Error from '../../pages/error';

const Routes: React.FC = (props) => {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/album" component={Album} />
        <Route path="*" component={Error} />
      </Switch>
    </Router>
  );
};

export default Routes;
