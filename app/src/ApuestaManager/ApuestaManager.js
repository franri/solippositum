import React  from 'react';


class ApuestaManager extends React.Component{

    state = {
        lengthId: null,
        contract: null
    };

    componentDidMount() {
        const { drizzle } = this.props;
        const contract = drizzle.contracts.ApuestaManager;
        let lengthId = contract.methods["apuestasLength"].cacheCall();
        let apuestasId = contract.methods["getApuestas"].cacheCall();
        this.setState({ ...this.state, lengthId, apuestasId });
    }

    render() {
        const { ApuestaManager } = this.props.drizzleState.contracts;

        let addresses = ApuestaManager.getApuestas[this.state.apuestasId];

        
        return <ul>
            { addresses && 
            addresses.value.map((addr, idx)=>{
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