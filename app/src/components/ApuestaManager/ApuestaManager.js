import React  from 'react';
import {Link} from "react-router-dom";
import './ApuestaManager.css'

class ApuestaManager extends React.Component{


    constructor(props){
        super();
        const { drizzle } = props;
        const contract = drizzle.contracts.ApuestaManager;
        let lengthId = contract.methods["apuestasLength"].cacheCall();
        let apuestasId = contract.methods["getApuestas"].cacheCall();
        this.state = { lengthId, apuestasId, managedInstances: new Set(), events: [] }

        
        this.handleName = this.handleName.bind(this);
        this.handleEventId = this.handleEventId.bind(this);
        this.handleEventRatio = this.handleEventRatio.bind(this);
        this.handleOracle = this.handleOracle.bind(this);
        this.handleEventAdd = this.handleEventAdd.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
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

    handleName(event){
        this.setState({nombre: event.target.value})
    }
    handleEventId(event){
        this.setState({id: event.target.value})
    }
    handleEventRatio(event){
        this.setState({ratio: event.target.value})
    }
    handleOracle(event){
        this.setState({oraculo: event.target.value})
    }
    handleEventAdd(event){
        let ev = [parseInt(this.state.id), parseInt(this.state.ratio)];
        let prevEvents = this.state.events;
        prevEvents.push(ev);
        console.log(prevEvents);
        this.setState({id: "", ratio: "", events: prevEvents})
    }
    handleSubmit(event){
        console.log(this.state);
    }

    render() {
        let addressesA = [...this.state.managedInstances].sort();
        return <>
                <div className="bg">
                    <div className="addresses">
                        <ul>
                        { addressesA && 
                        addressesA.map((addr, idx)=>{
                            return <li key={idx} > 
                                <Link to={{ pathname: `/Apuesta/${addr}` }}>{addr}</Link>
                                {/* <ContratoApuestas drizzle={drizzle} drizzleState={drizzleState} contractAddress={addr}/> */}
                            </li>
                        })
                        }
                        </ul>
                    </div>
                    <div className="newBidForm">
                        <h3>Crear apuesta</h3>
                        <div>
                            <div>
                                <span>Nombre de la apuesta </span>
                                <input type="text" value={this.state.nombre} onChange={this.handleName} />
                            </div>
                            <div>
                                <span>Oráculo </span>
                                <input type="text" value={this.state.oraculo} onChange={this.handleOracle} />     
                            </div>
                            <div>
                                <span>Id evento </span>
                                <input type="text" value={this.state.id} onChange={this.handleEventId} />
                            </div>
                            <div>
                                <span>Ratio evento </span>
                                <input type="text" value={this.state.ratio} onChange={this.handleEventRatio} />         
                            </div>
                            <button onClick={this.handleEventAdd}>Agregar evento</button>
                            <h3>Eventos:</h3>
                            <ul>
                                {this.state.events && this.state.events.map((e, i)=><li key={i}>id {e[0]}, ratio {e[1]}</li>)}
                            </ul>
                            <button onClick={this.handleSubmit}>Crear apuesta</button>
                        </div>
                    </div>
                    </div>
                </>
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