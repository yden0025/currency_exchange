import React, { useEffect } from "react";
import { getCurrency } from "./redux/currency/slice";
import { useDispatch } from "react-redux";
import styles from './App.module.css';
import Header from './components/Header/Header';
import Rates from './pages/Rates';
import Charts from './pages/Charts';
import Saved from './pages/Saved';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

const App: React.FC = (props) => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getCurrency())
  }, []);

  return (
    <div className={styles.App}>
      <Router>
        <Header></Header>
        <Switch>
          <Route exact path="/" component={Rates} />
          <Route path="/charts" component={Charts} />
          <Route path="/saved" component={Saved} />
        </Switch>
      </Router>
    </div>
  )
}

export default App;
