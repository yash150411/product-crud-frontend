import {BrowserRouter as Router, Redirect, Route, Switch} from 'react-router-dom';
import Dashboard from './pages/dashboard';

function App() {
  return (
    <div className="App" style={{padding:'0px 10px'}}>
      <h2 style={{textAlign:'center', color: '#F28C5E'}}>Products CRUD</h2>
      <Router>
        <Switch>
          <Route path="/dashboard" component={Dashboard}/>
          <Route exact path="/" render={() => (<Redirect to="/dashboard"/>)} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
