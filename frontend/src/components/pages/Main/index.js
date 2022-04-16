import React from 'react';

import Index from "../../organisms/Canvas";
import CardList from "../../organisms/CardList";

import "./index.scss";


const Main = () => {
    return (
        <div className="main-page">
            <Index />
            <CardList />
        </div>
    )
}

export default Main;