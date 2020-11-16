import React from "react";
import { DrizzleContext } from "@drizzle/react-plugin";
import { Drizzle } from "@drizzle/store";
import drizzleOptions from "./drizzleOptions";
//import MyComponent from "./MyComponent";
import ContratoApuestas from "./components/ContratoApuestas";
import ApuestaManager from './ApuestaManager/ApuestaManager'
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

          return (
             //<ApuestaManager drizzle={drizzle} drizzleState={drizzleState}/>
            <ContratoApuestas drizzle={drizzle} drizzleState={drizzleState}/>
          )
        }}
      </DrizzleContext.Consumer>
    </DrizzleContext.Provider>
  );
}


export default App;
