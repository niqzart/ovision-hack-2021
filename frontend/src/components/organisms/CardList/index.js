import React from 'react';
import { useStore } from 'effector-react'
import {$cardStore} from "../../../state/cardList";

import "./index.scss";

import Card from "../Card"


const CardList = () => {
    const cardStore = useStore($cardStore);

    const cardList = cardStore.map(card => {
        return <Card age={card.age} gender={card.gender} emotion={card.emotion} key={card.id}/>
    });

    return(
        <div id="card-list">
            {cardList}
        </div>
    )
}


export default CardList;