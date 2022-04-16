import React from 'react';
import {getFaceCoordinates} from "../modules/face";


async function getTransformedImageFromVideo(image_container, video, width, height) {
    image_container.innerHTML = "";
    let faceDimensions = await getFaceCoordinates(video);
    for (let i = 0; i < faceDimensions.length; ++i) {
        const iFace = faceDimensions[i];
        let canvas = document.createElement("canvas");
        canvas.setAttribute("width", width);
        canvas.setAttribute("height", height);
        let context = canvas.getContext("2d");
        context.drawImage(video, iFace.topLeftX, iFace.topLeftY, iFace.width, iFace.height, 0, 0, width, height);
        image_container.appendChild(canvas);
    }
}


class Camview extends React.Component {
    constructor(props) {
        super(props);
        this.video = React.createRef();
        this.container = React.createRef();
        this.canvas = React.createRef();
        this.image = {
            intervalMs: 600,
            timeout: null
        }
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

    handleRepeatImageDisplay = () => {
        this.image.timeout = setInterval(() => {
            getTransformedImageFromVideo(this.container.current, this.video.current, 640, 640)
                .catch(e => console.log(e));
        }, this.image.intervalMs);
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
        clearInterval(this.image.timeout);
        // this.video.current.removeEventListener('play', this.handleFaceCoordinates, false);
    }

    render() {
        return <div className="camera">
            <button id="button__take" onClick={this.handleButtonClick} >Take photo</button>
            <video id="video" height="480" width="640" onPlay={this.handleRepeatImageDisplay} ref={this.video}/>
            <div className="image-container" ref={this.container} />
            {/*<canvas id="canvas" height="480" width="640" ref={this.canvas}/>*/}
        </div>;
    }
}

export default Camview;