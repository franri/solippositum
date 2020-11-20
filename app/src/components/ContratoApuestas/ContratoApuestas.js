import React from "react";
import EventItem from "./EventItem";

import Apuesta from "../../contracts/Apuesta.json";

class ContratoApuestas extends React.Component {
    state = { dataKeyName: null , dataKeyEvents: null, dataKeyBetStatus: null, dataKeyWinner: null, amountToBet:0, selection:0};


    handleChangeAmount = this.handleChangeAmount.bind(this);
    handleChangeSelection = this.handleChangeSelection.bind(this);
    handleSubmitBet = this.handleSubmitBet.bind(this);

    componentDidMount() {
      const { drizzle } = this.props;
      const { contractAddress } = this.props.props.match.params;
      const contract = drizzle.contracts["Apuesta "+contractAddress];
      let dataKeyName = contract.methods["nombre"].cacheCall(); // declare this call to be cached and synchronized
      let dataKeyEvents = contract.methods["getEvents"].cacheCall(); // declare this call to be cached and synchronized
      let dataKeyBetStatus = contract.methods["estado"].cacheCall(); // declare this call to be cached and synchronized
      this.setState({ dataKeyName:dataKeyName, dataKeyEvents:dataKeyEvents, dataKeyBetStatus:dataKeyBetStatus});
      //let dataKeyWinner = contract.methods["eventoGanador"].cacheCall(); // declare this call to be cached and synchronized
      //this.setState({ dataKeyName:dataKeyName, dataKeyEvents:dataKeyEvents, dataKeyBetStatus:dataKeyBetStatus, dataKeyWinner:dataKeyWinner });
      //const { Apuesta } = this.props.drizzleState.contracts;
    }
    constructor(props) {
      super();
      console.log(props);
      this.props = props;
      const { drizzle } = props;
      const { contractAddress } = props.props.match.params;
      if (drizzle && !drizzle.contracts["Apuesta "+contractAddress])
        this.addNewContract(contractAddress);
    }

    handleChangeAmount(event) {
      this.setState({amountToBet: event.target.value});
      //console.log(event.target.value);
    }

    handleChangeSelection(event) {
      this.setState({selection: event.target.value});
      //console.log(event.target.value);
    }

    handleSubmitBet(event) {
      console.log(this.state.amountToBet);
      console.log(this.state.selection);
      var state = this.props.drizzle.store.getState()
      //console.log(this.props.drizzleState.accounts[0]);
      
      const { contractAddress } = this.props.props.match.params;
      const stackId = this.props.drizzle.contracts["Apuesta "+contractAddress].methods.registerBid.cacheSend(this.state.selection, {from: this.props.drizzleState.accounts[0], value:this.state.amountToBet})

      if (state.drizzleStatus.initialized) {
        // Use the stackId to display the transaction status.
        if (state.transactionStack[stackId]) {
          const txHash = state.transactionStack[stackId];
          //console.log(state.transactions[txHash].status);
          return state.transactions[txHash].status
        }
      }
    }

    getBetStatus(num){
      switch(num){
        case "0":
          return "Apuestas abiertas"
        case "1":
          return "Apuestas cerradas"
        case "2":
          return "Procesando apuestas"
        case "3":
          return "Pagos realizados"
        case "4":
          return "Pagos no realizados"
        default:
          return "Opa, cosas raras"
      }
    }

    addNewContract(newAddress){
      let contractName = "Apuesta " + newAddress;
      const { drizzle  } = this.props;
      let web3 = drizzle.web3;
      let web3Contract = new web3.eth.Contract(Apuesta.abi, newAddress) //second argument is new contract's address 
                                                
      let contractConfig = { contractName, web3Contract }
      //let events = ['LogFundingReceived']
    
      // Using the Drizzle context object
      drizzle.addContract(contractConfig/*, events*/)
      //console.log("antes de timeout");
      setTimeout(()=>{
        const contract = drizzle.contracts[contractName];
        let dataKeyName = contract.methods["nombre"].cacheCall(); // declare this call to be cached and synchronized
        let dataKeyEvents = contract.methods["getEvents"].cacheCall(); // declare this call to be cached and synchronized
        let dataKeyBetStatus = contract.methods["estado"].cacheCall(); // declare this call to be cached and synchronized
        this.setState({ dataKeyName:dataKeyName, dataKeyEvents:dataKeyEvents, dataKeyBetStatus:dataKeyBetStatus});
        let dataKeyWinner = contract.methods["eventoGanador"].cacheCall(); // declare this call to be cached and synchronized
        this.setState({ dataKeyName:dataKeyName, dataKeyEvents:dataKeyEvents, dataKeyBetStatus:dataKeyBetStatus, dataKeyWinner:dataKeyWinner });
       }, 100)
      
    }

    render() {
      
      const { drizzle, drizzleState } = this.props;
      if (!drizzle || !drizzleState){
        return <p>Loading...</p>
      }
      const { contractAddress } = this.props.props.match.params;
      //console.log(contractAddress);
      const contract = drizzleState.contracts["Apuesta "+contractAddress];
      //console.log(contract);
      if(!contract){
        return <p>Loading...</p>
      }
      const contractName = contract.nombre && contract.nombre[this.state.dataKeyName]; // if displayData (an object) exists, then we can display the value below
      const contractEvents = contract.getEvents && contract.getEvents[this.state.dataKeyEvents]; // if displayData (an object) exists, then we can display the value below
      const contractStatus = contract.estado && contract.estado[this.state.dataKeyBetStatus]; // if displayData (an object) exists, then we can display the value below
      const contractWinner = contract.eventoGanador && contract.eventoGanador[this.state.dataKeyWinner]; // if displayData (an object) exists, then we can display the value below
      
      //console.log({from:this.props.drizzleState});
      //console.log(Apuesta);
      //console.log(contractEvents);
      //console.log(contractStatus);
      return (
        <div className="App">
            <h2>{contractName && contractName.value}</h2>
            <h5>Address: {this.props.props.match.params.contractAddress}</h5>
            <h5>Estado de la apuesta: {contractStatus && this.getBetStatus(contractStatus.value)}</h5>
            { contractWinner && 
            contractWinner.value !=0 && 
              <h5>Evento ganador: {contractWinner.value}</h5>
            
            }
            <h5>Total apostado:
            {contractEvents && contractEvents.value.reduce((total, value) => {
              // if the value is an array then recursively call reduce
              // if the value is not an array then just concat our value
              return total+=parseInt(value.cantidadApostada);
            }, 0)
            } Gwei</h5>
            {contractEvents &&
                //console.log(contractEvents)
                contractEvents.value.map((e, i) => (
                    <EventItem e = {e} key={i}/>
                ))
            }
            <h3>Apostar</h3>

              {contractStatus && contractStatus.value === "0" && 
              <div>
              <input type="text" style={{"margin" : "5px"}} value={this.state.amountToBet} onChange={this.handleChangeAmount}/>
              <select value={this.state.selection} style={{"margin" : "5px"}} onChange={this.handleChangeSelection}>
              {contractEvents &&
                //console.log(contractEvents)
                contractEvents.value.map((e, i) => (
                    <option value={e.id} key={i}>{e.id}</option>
                ))}
              </select>
              <input type="submit" style={{"margin" : "5px"}} value="Submit" onClick={this.handleSubmitBet}/>
              </div>
              }
              {contractStatus && contractStatus.value !== "0" && 
              <div>
              Apuestas cerradas
              </div>
              }

            {/*<ContractForm 
              drizzle = {this.props.drizzle}
              contract="Apuesta"
              method="registerBid"
              sendArgs={{from:this.props.drizzleState.accounts[0], value:this.state.amountToBet}}
              labels={["Evento"]}
            />*/}

            
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