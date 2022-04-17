import { useSocketIO, useWindowSize } from "../../../utils/effects"
import useReceiver from "../../../utils/receiver"
import Emitter from "../../../utils/emitter"

import Canvas from "../../organisms/Canvas"
import CardList from "../../organisms/CardList"

import "./index.scss"
import {dtoToCardList} from "../../../state/Card";


function MainDesktopLayout({ data, emitter }) {
}

const Main = ({className}) => {

    const socket = useSocketIO()

    const emitter = new Emitter(socket)
    const cardsData = dtoToCardList(useReceiver(socket));
    
    if (socket === null)
        return <div className="main-page main-page__socket-null">
            <span>Loading...</span>
        </div>

    return (
    <div className="main-page">
        <CardList className="card-list" data={cardsData} />
        <Canvas emitter={emitter} />
    </div>
    );
}

export default Main;
