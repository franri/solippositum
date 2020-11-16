import React from "react";
import { newContextComponents } from "@drizzle/react-components";
import EventItem from "./EventItem";

const { ContractForm } = newContextComponents;

class ContratoApuestas extends React.Component {
    state = { dataKeyName: null , dataKeyEvents: null, amountToBet:'', selection:'' };
    handleChangeAmount = this.handleChangeAmount.bind(this);
    handleChangeSelection = this.handleChangeSelection.bind(this);


    componentDidMount() {
      const { drizzle } = this.props;
      const contract = drizzle.contracts.Apuesta;
      let dataKeyName = contract.methods["nombre"].cacheCall(); // declare this call to be cached and synchronized
      let dataKeyEvents = contract.methods["getEvents"].cacheCall(); // declare this call to be cached and synchronized
      this.setState({ dataKeyName, dataKeyEvents });
    }
    handleChangeAmount(event) {
      this.setState({amountToBet: event.target.value});
      console.log(event.target.value);
    }
    handleChangeSelection(event) {
      this.setState({selection: event.target.value});
      //console.log(event.target.value);
    }
    render() {
      const { Apuesta } = this.props.drizzleState.contracts;
      const contractName = Apuesta.nombre[this.state.dataKeyName]; // if displayData (an object) exists, then we can display the value below
      const contractEvents = Apuesta.getEvents[this.state.dataKeyEvents]; // if displayData (an object) exists, then we can display the value below
      //console.log({from:this.props.drizzleState});
      //console.log(Apuesta);
      return (
        <div className="App">
            <h2>{contractName && contractName.value}</h2>
            {contractEvents &&
                //console.log(contractEvents)
                contractEvents.value.map((e, i) => (
                    <EventItem e = {e} key={i}/>
                ))
            }
            <h3>Apostar</h3>
            <div>
              <input type="text" value={this.state.amountToBet} onChange={this.handleChangeAmount} />
              <select value={this.state.selection} onChange={this.handleChangeSelection}>
              {contractEvents &&
                //console.log(contractEvents)
                contractEvents.value.map((e, i) => (
                    <option value={e.id} key={i}>{e.id}</option>
                ))}
              </select>
            {/*<ContractForm 
              drizzle = {this.props.drizzle}
              contract="Apuesta"
              method="registerBid"
              sendArgs={{from:this.props.drizzleState.accounts[0], value:this.state.amountToBet}}
              labels={["Evento"]}
            />*/}
            </div>
            
        </div>
      )
    }
   }
   
   export default ContratoApuestas

/* 
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
*/