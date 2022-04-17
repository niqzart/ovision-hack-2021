import React from 'react';
import { useSocketIO, useWindowSize } from "../../../utils/effects"
import Emitter from "../../../utils/emitter"
import useReceiver from "../../../utils/receiver"

import Canvas from "../../organisms/Canvas";
import CardList from "../../organisms/CardList";

import "./index.scss";

function MainMobileLayout({ data, emitter }) {
    // TODO edit this!

    return <div className="main-page">
        <CardList className="card-list" data={data} />
        <Canvas emitter={emitter} />
    </div>
}

function MainDesktopLayout({ data, emitter }) {
    return <div className="main-page">
        <CardList className="card-list" data={data} />
        <Canvas emitter={emitter} />
    </div>
}

const Main = () => {
    const width = useWindowSize()[0]

    const socket = useSocketIO()

    const emitter = new Emitter(socket)
    const cardsData = useReceiver(socket)

    // TODO make this beautiful
    if (socket === null) return <div>Loading</div>

    // TODO error handling!

    return width < 500 ? <MainMobileLayout /> : <MainDesktopLayout />
}

export default Main;
