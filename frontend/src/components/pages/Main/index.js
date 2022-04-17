import { useSocketIO, useWindowSize } from "../../../utils/effects"
import Emitter from "../../../utils/emitter"

import Canvas from "../../organisms/Canvas"
import CardList from "../../organisms/CardList"

import "./index.scss"


function MainDesktopLayout({ data, emitter }) {
}

const Main = ({className}) => {

    const socket = useSocketIO()

    const emitter = new Emitter(socket)
    
    if (socket === null)
        return <div className="main-page main-page__socket-null">
            <span>Loading...</span>
        </div>

    return (
    <div className="main-page">
        <CardList className="card-list" socket={socket} />
        <Canvas emitter={emitter} />
    </div>
    );
}

export default Main;
