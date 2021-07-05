import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Top from './pages/Top';
// import Search from './pages/Search';

function App() {
  return (
    <Router>
      <Route exact path='/' component={Top} />
      {/* <Route exact path='/search' component={Search} /> */}
    </Router>
  );
}

export default App;