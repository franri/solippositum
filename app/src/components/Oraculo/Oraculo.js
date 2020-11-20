import React from "react";

import Apuesta from "../../contracts/Apuesta.json";

class Oraculo extends React.Component {
    state = { dataKeyName: null , dataKeyEvents: null, dataKeyBetStatus: null, dataKeyWinner: null, amountToBet:0, selection:0};


    handleCerrar = this.handleCerrar.bind(this);
    handleAnunciar = this.handleAnunciar.bind(this);

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

    handleCerrar(event){
      
      const { contractAddress } = this.props.props.match.params;
      this.props.drizzle.contracts["Apuesta "+contractAddress].methods.cerrarApuestas.cacheSend({from: this.props.drizzleState.accounts[0]})//
    }
    handleAnunciar(id){
    
      const { contractAddress } = this.props.props.match.params;
      this.props.drizzle.contracts["Apuesta "+contractAddress].methods.recibirEventoDelOraculo.cacheSend(id, {from: this.props.drizzleState.accounts[0]})
      
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
        this.setState({ dataKeyName:dataKeyName, dataKeyEvents:dataKeyEvents, dataKeyBetStatus:dataKeyBetStatus});
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
      const contractEvents = contract.getEvents && contract.getEvents[this.state.dataKeyEvents]; // if displayData (an object) exists, then we can display the value below
      const contractStatus = contract.estado && contract.estado[this.state.dataKeyBetStatus]; // if displayData (an object) exists, then we can display the value below
      //const contractWinner = contract.eventoGanador && contract.eventoGanador[this.state.dataKeyWinner]; // if displayData (an object) exists, then we can display the value below
      
      //console.log({from:this.props.drizzleState});
      //console.log(Apuesta);
      //console.log(contractEvents);
      //console.log(contractStatus);
      return (
        <div className="App">
            <h2>{contractName && contractName.value}</h2>
            <h5>Address: {this.props.props.match.params.contractAddress}</h5>
            <h5>Estado de la apuesta: {contractStatus && this.getBetStatus(contractStatus.value)}</h5>
            { contractStatus && contractStatus.value === "0" &&
                <button onClick={this.handleCerrar}>Cerrar apuestas</button>
            }
            { contractStatus && contractStatus.value === "1" &&
                <h5>Anunciar evento ganador</h5>}

            {contractStatus && contractStatus.value === "1" && contractEvents &&
                //console.log(contractEvents)
                contractEvents.value.map((e, i) => (
                <button onClick={()=>this.handleAnunciar(e.id)}>{e.id}</button>
                ))
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
   
   export default Oraculo;