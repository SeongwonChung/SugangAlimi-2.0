import React from 'react';
import { Route } from 'react-router-dom';
import {
  Landing,
  Search,
  Favorite,
  Support,
  Login,
  Signup,
  Mypage,
} from './pages/index.js';

function App() {
  return (
    <div className="App">
      <Route path="/" exact={true} component={Landing} />
      <Route path="/search" component={Search} />
      <Route path="/favorite" exact={true} component={Favorite} />
      <Route path="/support" component={Support} />
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      <Route path="/mypage" component={Mypage} />
    </div>
  );
}

export default App;
