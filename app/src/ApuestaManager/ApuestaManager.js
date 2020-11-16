import React  from 'react';

import Apuesta from "./../contracts/Apuesta.json"


class ApuestaManager extends React.Component{

    constructor(props){
        super();
        const { drizzle } = props;
        const contract = drizzle.contracts.ApuestaManager;
        let lengthId = contract.methods["apuestasLength"].cacheCall();
        let apuestasId = contract.methods["getApuestas"].cacheCall();
        this.state = { lengthId, apuestasId, managedInstances: new Set() }
    }

    addNewContract = (newAddress) => {

        let contractName = "Apuesta " + newAddress;
        let web3 = this.props.drizzle.web3;
        if (this.state.managedInstances.has(newAddress)){
            return;
        }
        this.state.managedInstances.add(newAddress);
        let web3Contract = new web3.eth.Contract(Apuesta.abi, newAddress) //second argument is new contract's address 
                                                  
        let contractConfig = { contractName, web3Contract }
        //let events = ['LogFundingReceived']
      
        // Using the Drizzle context object
        this.props.drizzle.addContract(contractConfig/*, events*/)
        console.log(this.props.drizzle.contracts);
      }

    componentDidMount(){
        
    }

    render() {
        const { ApuestaManager } = this.props.drizzleState.contracts;

        let addresses = ApuestaManager.getApuestas[this.state.apuestasId];
        
        if (addresses){
            addresses.value.forEach(addr => this.addNewContract(addr));
        }

        let addressesA = [...this.state.managedInstances].sort();

        return <ul>
            <li>hola</li>
            { addressesA && 
            addressesA.map((addr, idx)=>{
                return <li key={idx} > {addr} </li>
            })
            }
            </ul>
    }
}

export default ApuestaManager;


// export class ApuestaManager extends React.Component {
//     state = {};

//     constructor({drizzle, drizzleState}){
//         this.state = drizzle.store.getState();
//         console.log(this.state);
//     }


//     render() {
//         if (this.state.drizzleState.drizzleStatus.initialized){
//             return <p>hola</p>
//         }
//     }


// }