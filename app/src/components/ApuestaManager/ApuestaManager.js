import React  from 'react';
import {Link} from "react-router-dom";

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
        if (this.state.managedInstances.has(newAddress)){
            return;
        }
        this.state.managedInstances.add(newAddress);
      }

    componentDidUpdate(){
        const { ApuestaManager } = this.props.drizzleState.contracts;
        let addresses = ApuestaManager.getApuestas[this.state.apuestasId];
        // console.log("componentDidUpdate");
        // console.log(addresses);
        let setAntes = [...this.state.managedInstances].sort().toString();
        if (addresses){
            addresses.value.forEach(addr => {
                this.addNewContract(addr);
            });
            let setDespues = [...this.state.managedInstances].sort().toString();
            if (setAntes !== setDespues)
                this.forceUpdate();
        }
    }

    render() {
        let addressesA = [...this.state.managedInstances].sort();
        return <ul>
            { addressesA && 
            addressesA.map((addr, idx)=>{
                return <li key={idx} > 
                    <Link to={{ pathname: `/Apuesta/${addr}` }}>{addr}</Link>
                    {/* <ContratoApuestas drizzle={drizzle} drizzleState={drizzleState} contractAddress={addr}/> */}
                </li>
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