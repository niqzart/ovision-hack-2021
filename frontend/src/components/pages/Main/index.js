import React from 'react';
import { useSocketIO } from "../../../utils/effects"
import Emitter from "../../../utils/emitter"
import useReceiver from "../../../utils/receiver"

import Canvas from "../../organisms/Canvas";
import CardList from "../../organisms/CardList";

import "./index.scss";

const Main = () => {
    const socket = useSocketIO()

    const emitter = new Emitter(socket)
    const cardsData = useReceiver(socket)

    // TODO make this beautiful
    if (socket === null) return <div>Loading</div>

    return (
        <div className="main-page">
            <CardList className="card-list" data={cardsData} />
            <Canvas emitter={emitter} />
        </div>
    )
}

export default Main;
