import React from "react";
import { newContextComponents } from "@drizzle/react-components";
import EventItem from "./EventItem";

const { AccountData, ContractData, ContractForm } = newContextComponents;

class ContratoApuestas extends React.Component {
    state = { dataKeyName: null , dataKeyEvents: null };
   
    componentDidMount() {
      const { drizzle } = this.props;
      const contract = drizzle.contracts.Apuesta;
      let dataKeyName = contract.methods["nombre"].cacheCall(); // declare this call to be cached and synchronized
      let dataKeyEvents = contract.methods["getEvents"].cacheCall(); // declare this call to be cached and synchronized
      this.setState({ dataKeyName, dataKeyEvents });
    }
   
    render() {
      const { Apuesta } = this.props.drizzleState.contracts;
      const contractName = Apuesta.nombre[this.state.dataKeyName]; // if displayData (an object) exists, then we can display the value below
      const contractEvents = Apuesta.getEvents[this.state.dataKeyEvents]; // if displayData (an object) exists, then we can display the value below
      return (
        <div className="App">
            <h2>{contractName && contractName.value}</h2>
            {contractEvents &&
                //console.log(contractEvents.value)
                contractEvents.value.map((e) => (
                    <EventItem e = {e}/>
                ))
            }
        </div>
      )
    }
   }
   
   export default ContratoApuestas

{/* 
export default ({ drizzle, drizzleState }) => {
  // destructure drizzle and drizzleState from props
  return (
    <div className="App">
        <h2>
            <ContractData
                drizzle={drizzle}
                drizzleState={drizzleState}
                contract="Apuesta"
                method="nombre"
            />
        </h2>
        <p>
          <strong>Eventos: </strong>
        </p>
        <div className="idEvento">
        <ContractData
                drizzle={drizzle}
                drizzleState={drizzleState}
                contract="Apuesta"
                method="getEvents"
            />
        </div>
        
    </div>
  );
};
*/}