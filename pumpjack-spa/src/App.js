import React, { useReducer } from "react";
import ReactDOM from "react-dom";
import { Switch, Route, HashRouter, withRouter } from "react-router-dom";

import Header from './components/Header'

import Home from "./views/Home";
import User from "./views/User";
import Products from "./views/Products";

import './App.sass'

import { Context, initialState, reducer } from "./store";

//import logo from './logo.svg';

//import './App.sass';
//import './App.css';

const NoMatch = () => <div className="title">&nbsp;404 Not Found</div>;

var hasData = false;

const loadData = () => {

  return new Promise((resolve) => {

  var userData, productData;

  fetch('http://localhost:8080/getUsers', {
  method: 'GET', // or 'PUT'
/*  body: JSON.stringify(payload), // data can be `string` or {object}!
    headers:{
  'Content-Type': 'application/json'
} */
  }).then(res => res.json())
  .then(response => {

  //alert(JSON.stringify(response));

  userData = response;

  fetch('http://localhost:8080/getProducts', {
  method: 'GET', // or 'PUT'
/*  body: JSON.stringify(payload), // data can be `string` or {object}!
    headers:{
  'Content-Type': 'application/json'
} */
  }).then(res => res.json())
  .then(response => {

  //alert(JSON.stringify(response[2]));

  productData = response;

  resolve({userData: userData, productData: productData});


  })
  .catch(error => alert('Error1:' + error));

  })
  .catch(error => alert('Error2:' + error));

});

};

function App() {
  const [store, dispatch] = useReducer(reducer, initialState);

  if(hasData === false)
  {
    hasData = true;
    loadData().
      then(res => {
        // alert(JSON.stringify(res.productData));
        dispatch({ type: "setAll", products: res.productData, users: res.userData});
      });
    }

  return (
    <Context.Provider value={{ store, dispatch }}>
      <HashRouter>
      <Header /> <br/>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/user/:id" component={User} />
          <Route exact path="/products" component={Products} />
          <Route path="*" component={NoMatch} />
        </Switch>
      </HashRouter>
    </Context.Provider>
  );
}

export default App;
