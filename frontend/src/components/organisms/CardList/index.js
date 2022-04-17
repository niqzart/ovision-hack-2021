import React from "react";
import { useStore } from "effector-react"
import { $cardStore } from "../../../state/cardStore";

import "./index.scss";

import Card from "../Card"


const CardList = ({ className, data }) => {
    // data is a list of cards' info

    const cardStore = useStore($cardStore);

    const cardList = cardStore.map(card => {
        return <Card className="card-list__card card" age={card.age} gender={card.gender} emotion={card.emotion} key={card.id} />
    });

    return (
        <div id="card-list" className={className}>
            {cardList}
        </div>
    )
}


export default CardList;