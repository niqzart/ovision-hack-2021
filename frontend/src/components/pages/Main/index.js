import React from 'react';


import Canvas from "../../organisms/Canvas";
import CardList from "../../organisms/CardList";

import "./index.scss";

const Main = () => {

    return (
        <div className="main-page">
            <CardList className="card-list"/>
            <Canvas />
        </div>
    )
}

export default Main;