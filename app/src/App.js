import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom"
import { DrizzleContext } from "@drizzle/react-plugin";
import { Drizzle } from "@drizzle/store";
import drizzleOptions from "./drizzleOptions";
//import MyComponent from "./MyComponent";
import ContratoApuestas from "./components/ContratoApuestas/ContratoApuestas";
import ApuestaManager from './components/ApuestaManager/ApuestaManager'
import Oraculo from './components/Oraculo/Oraculo'
import Organizador from './components/Organizador/Organizador'
import Banner from './components/Banner/Banner'
import "./App.css";

const drizzle = new Drizzle(drizzleOptions);

const App = () => {
  return (
    <DrizzleContext.Provider drizzle={drizzle}>
      <DrizzleContext.Consumer>
        {drizzleContext => {
          const { drizzle, drizzleState, initialized } = drizzleContext;
          if (!initialized) {
            return "Loading..."
          }
      if (!drizzle || !drizzleState){
        return <p>Loading...</p>
      }
          return (
            <span className="App">
              <Banner/>
              <Router>
                <Switch>
                  <Route path="/Apuesta/:contractAddress"  render={(props) => <ContratoApuestas props={props} drizzle={drizzle} drizzleState={drizzleState}/>}/>
                  <Route path="/Oraculo/:contractAddress"  render={(props) => <Oraculo props={props} drizzle={drizzle} drizzleState={drizzleState}/>}/>
                  <Route path="/Organizador/:contractAddress"  render={(props) => <Organizador props={props} drizzle={drizzle} drizzleState={drizzleState}/>}/>                  
                  <Route path={["/","/ApuestaManager"]}>
                    <ApuestaManager drizzle={drizzle} drizzleState={drizzleState}/>
                  </Route>
              </Switch>
              </Router>
            </span>
          )
        }}
      </DrizzleContext.Consumer>
    </DrizzleContext.Provider>
  );
}


export default App;
