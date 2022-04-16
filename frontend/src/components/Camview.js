import React from 'react';
import {getFaceCoordinates, getTransformedImageFromVideo} from "../modules/face";


class Camview extends React.Component {
    constructor(props) {
        super(props);
        this.video = React.createRef();
        this.container = React.createRef();
        this.canvas = React.createRef();
    }


    handleFaceCoordinates = (event) => {
        getFaceCoordinates(event.target)
            .then(v => console.log(v))
            .catch(e => console.log(e));
    }

    handleButtonClick = () => {
        getTransformedImageFromVideo(this.container.current, this.video.current, 640, 480)
            .catch(e => console.log(e));
    }


    componentDidMount() {
        // this.video.current.addEventListener('play', this.handleFaceCoordinates, false);
        const object = this;
        navigator.mediaDevices.getUserMedia({video: true, audio: false})
            .then((stream) => {
                console.log(stream);
                object.video.current.srcObject = stream;
                object.video.current.play();
            })
            .catch(function (err) {
                console.log("An error occurred there: " + err);
            });
    }

    componentWillUnmount() {
        //     this.video.current.removeEventListener('play', this.handleFaceCoordinates, false);
    }

    render() {
        return <div className="camera">
            <button id="button__take" onClick={this.handleButtonClick} >Take photo</button>
            <video id="video" height="480" width="640" onPlay={this.handleFaceCoordinates} ref={this.video}/>
            <div className="image-container" ref={this.container} />
            {/*<canvas id="canvas" height="480" width="640" ref={this.canvas}/>*/}
        </div>;
    }
}

export default Camview;