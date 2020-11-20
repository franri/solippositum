import React from "react";

import Apuesta from "../../contracts/Apuesta.json";

class Organizador extends React.Component {
    state = { dataKeyName: null , dataKeyEvents: null, dataKeyBetStatus: null, dataKeyWinner: null, amountToBet:0, selection:0, monto:0};


    handleMonto = this.handleMonto.bind(this);
    handlePagar = this.handlePagar.bind(this);

    componentDidMount() {
      const { drizzle } = this.props;
      const { contractAddress } = this.props.props.match.params;
      const contract = drizzle.contracts["Apuesta "+contractAddress];
      let dataKeyName = contract.methods["nombre"].cacheCall(); // declare this call to be cached and synchronized
      let dataKeyEvents = contract.methods["getEvents"].cacheCall(); // declare this call to be cached and synchronized
      let dataKeyBetStatus = contract.methods["estado"].cacheCall(); // declare this call to be cached and synchronized
      let dataKeyplataDelOrganizador = contract.methods["plataDelOrganizador"].cacheCall(); // declare this call to be cached and synchronized
      let dataKeyPlataRequerida = contract.methods["plataRequerida"].cacheCall(); // declare this call to be cached and synchronized
      this.setState({ dataKeyName:dataKeyName, dataKeyEvents:dataKeyEvents, dataKeyBetStatus:dataKeyBetStatus, dataKeyplataDelOrganizador, dataKeyPlataRequerida});
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

    handleMonto(event){
        this.setState({monto: event.target.value});
    }
    handlePagar(event){
      //console.log(this.props.drizzleState.accounts[0]);
      //console.log(this.props);
      //return;
      var state = this.props.drizzle.store.getState()
      const { contractAddress } = this.props.props.match.params;
      const stackId = this.props.drizzle.contracts["Apuesta "+contractAddress].methods.deposit.cacheSend({from: this.props.drizzleState.accounts[0], value:this.state.monto})
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
          return "Apuestas abiertas";
        case "1":
          return "Apuestas cerradas";
        case "2":
          return "Procesando apuestas";
        case "3":
          return "Pagos realizados";
        case "4":
          return "Pagos no realizados";
        default:
            return "Opa, cosas raras. El enum no tiene map.";
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
        let dataKeyplataDelOrganizador = contract.methods["plataDelOrganizador"].cacheCall(); // declare this call to be cached and synchronized
        let dataKeyPlataRequerida = contract.methods["plataRequerida"].cacheCall(); // declare this call to be cached and synchronized
        this.setState({ dataKeyName:dataKeyName, dataKeyEvents:dataKeyEvents, dataKeyBetStatus:dataKeyBetStatus, dataKeyplataDelOrganizador, dataKeyPlataRequerida});
        //let dataKeyWinner = contract.methods["eventoGanador"].cacheCall(); // declare this call to be cached and synchronized
        //this.setState({ dataKeyName:dataKeyName, dataKeyEvents:dataKeyEvents, dataKeyBetStatus:dataKeyBetStatus, dataKeyWinner:dataKeyWinner });
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
      const contractStatus = contract.estado && contract.estado[this.state.dataKeyBetStatus]; // if displayData (an object) exists, then we can display the value below
      const plataRequerida = contract.plataRequerida && contract.plataRequerida[this.state.dataKeyPlataRequerida]
      const plataDelOrganizador = contract.plataDelOrganizador && contract.plataDelOrganizador[this.state.dataKeyplataDelOrganizador]
      //const contractWinner = contract.eventoGanador && contract.eventoGanador[this.state.dataKeyWinner]; // if displayData (an object) exists, then we can display the value below
      
      //console.log({from:this.props.drizzleState});
      //console.log(Apuesta);
      //console.log(contractEvents);
      //console.log(contractStatus);
      if (contractStatus && contractStatus.value === "1"){
          return(
            <div className="App">
            <h2>{contractName && contractName.value}</h2>
            <h5>Address: {this.props.props.match.params.contractAddress}</h5>
            <h5>Estado de la apuesta: {contractStatus && this.getBetStatus(contractStatus.value)}</h5>
            <h3>Plata requerida: {plataRequerida && plataRequerida.value}</h3>
            <h3>Plata depositada: {plataDelOrganizador && plataDelOrganizador.value}</h3>
            <h5>Poner fondos</h5>
            <input onChange={this.handleMonto}></input>
            <button onClick={this.handlePagar}>Depositar</button>
            
        </div>
          )
      } else {
          return(
            <div className="App">
                <h2>{contractName && contractName.value}</h2>
                <h5>Address: {this.props.props.match.params.contractAddress}</h5>
                <h5>Estado de la apuesta: {contractStatus && this.getBetStatus(contractStatus.value)}</h5>
                <h3>No puedes depositar en estos momentos</h3>
            </div>
          )
      }
    }
   }
   
   export default Organizador;