import React from "react";


class EventItem extends React.Component {   
  getStyle = () => {
    return {
      //background: '#eeeeee',
      padding: '10px',
      margin: '5px',
      rounded: "10%"
    }
  }
    render() {
      return (
        <div style={this.getStyle()}> Evento/Suceso:  {this.props.e.id}  Paga:  {this.props.e.ratio/10}</div>
      )
    }
   }
   
   export default EventItem