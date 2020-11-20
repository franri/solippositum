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
        this.state = { lengthId, apuestasId, managedInstances: {}, events: [] , nombre: '', id: '', ratio: '', oraculo: ''}

        
        this.handleName = this.handleName.bind(this);
        this.handleEventId = this.handleEventId.bind(this);
        this.handleEventRatio = this.handleEventRatio.bind(this);
        this.handleOracle = this.handleOracle.bind(this);
        this.handleEventAdd = this.handleEventAdd.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }


    addNewContract = (dupla) => {
        if (this.state.managedInstances[dupla.addr]){
            return;
        }
        this.state.managedInstances[dupla.addr] = dupla;
      }

    componentDidUpdate(){
        const { ApuestaManager } = this.props.drizzleState.contracts;
        let duplas = ApuestaManager.getApuestas[this.state.apuestasId];
        // console.log("componentDidUpdate");
        // console.log(addresses);
        let setAntes = Object.keys(this.state.managedInstances).map(k=>this.state.managedInstances[k]).map(e=>e.addr).sort().toString();
        if (duplas){
            duplas.value.forEach(dupla => {
                this.addNewContract(dupla);
            });
            let setDespues = Object.keys(this.state.managedInstances).map(k=>this.state.managedInstances[k]).map(e=>e.addr).sort().toString();
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
        this.setState({id: "", ratio: "", events: prevEvents})
    }
    handleSubmit(event){
        console.log(this.props);
        const { drizzle, drizzleState } = this.props;

        drizzle.contracts.ApuestaManager.methods.createApuesta.cacheSend(this.state.nombre, this.state.events, this.state.oraculo, {from: drizzleState.accounts[0]});
        
    }

    render() {
        let duplas = Object.keys(this.state.managedInstances).map(k=>this.state.managedInstances[k]).sort((a, b) => a.name > b.name);
        return <>
                <div className="bg">
                    <div className="addresses">
                        <ul>
                        { duplas && 
                        duplas.map((d, idx)=>{
                            return <li key={idx} > 
                                <span>{d.name}</span>
                                <Link to={{ pathname: `/Apuesta/${d.addr}` }}> apostador</Link>
                                <Link to={{ pathname: `/Organizador/${d.addr}` }}> organizador</Link>
                                <Link to={{ pathname: `/Oraculo/${d.addr}` }}> oraculo</Link>
                                {/* <ContratoApuestas drizzle={drizzle} drizzleState={drizzleState} contractAddress={addr}/> */}
                            </li>
                        })
                        }
                        </ul>
                    </div>
                    <div className="newBidForm">
                        <h3>Crear apuesta</h3>
                        <div>
                            <div style={{"margin" : "5px"}}>
                                <span>Nombre de la apuesta </span>
                                <input type="text" value={this.state.nombre} onChange={this.handleName} />
                            </div>
                            <div style={{"margin" : "5px"}}>
                                <span>Oráculo </span>
                                <input type="text" value={this.state.oraculo} onChange={this.handleOracle} />     
                            </div>
                            <div style={{"margin" : "5px"}}>
                                <span>Id evento </span>
                                <input type="text" value={this.state.id} onChange={this.handleEventId} />
                            </div>
                            <div style={{"margin" : "5px"}}>
                                <span>Ratio evento </span>
                                <input type="text" value={this.state.ratio} onChange={this.handleEventRatio} />         
                            </div>
                            <button style={{"margin" : "5px"}} onClick={this.handleEventAdd}>Agregar evento</button>
                            <h3>Eventos:</h3>
                            <ul>
                                {this.state.events && this.state.events.map((e, i)=><li style={{"margin" : "5px"}} key={i}>id {e[0]}, ratio {e[1]}</li>)}
                            </ul>
                            <button style={{"margin" : "5px"}} onClick={this.handleSubmit}>Crear apuesta</button>
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