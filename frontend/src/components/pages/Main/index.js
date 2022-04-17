import { useSocketIO, useWindowSize } from "../../../utils/effects"
import useReceiver from "../../../utils/receiver"
import Emitter from "../../../utils/emitter"

import Canvas from "../../organisms/Canvas"
import CardList from "../../organisms/CardList"

import "./index.scss"
import {dtoToCardList} from "../../../state/Card";

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

const Main = ({className}) => {
    const width = useWindowSize()[0]

    const socket = useSocketIO()

    const emitter = new Emitter(socket)
    const cardsData = dtoToCardList(useReceiver(socket));
    // const cardsData = dtoToCardList([{"age": "14", "gender": "Female"},{"age": "16", "gender": "Female"}])

    // TODO make this beautiful
    if (socket === null)
        return <div className="main-page main-page__socket-null">
            <span>Loading...</span>
        </div>

    // TODO error handling!

    return width < 500
        ? <MainMobileLayout className="mobile-layout" emitter={emitter} data={cardsData} />
        : <MainDesktopLayout className="desktop-layout" emitter={emitter} data={cardsData} />
}

export default Main;
