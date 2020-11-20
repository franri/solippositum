import React from 'react';
import "./Banner.css";

const Banner = () => {
    return(
        <div className="wrapper">
            <span className="title">Solippositum</span>
            <span className="subtitle" style={{"font-size":"22px"}}>Sistema de apuestas descentralizado basado en smart contracts</span>
        </div>
    );

}

export default Banner;