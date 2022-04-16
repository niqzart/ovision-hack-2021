import React from 'react';
import {getFaceCoordinates} from "../modules/face";


async function getTransformedImageFromVideo(image_container, video, width, height) {
    let faceDimensions = await getFaceCoordinates(video);
    for (let i = faceDimensions.length; i < image_container.childElementCount; ++i) {
        image_container.removeChild(image_container.children[i]);
    }
    for (let i = image_container.childElementCount; i < faceDimensions.length; ++i) {
        image_container.appendChild(document.createElement("canvas"));
    }
    for (let i = 0; i < faceDimensions.length; ++i) {
        const iFace = faceDimensions[i];
        image_container.children[i].setAttribute("width", width);
        image_container.children[i].setAttribute("height", height);
        let context = image_container.children[i].getContext("2d");
        context.drawImage(video, iFace.topLeftX, iFace.topLeftY, iFace.width, iFace.height, 0, 0, width, height);
    }
}

class Camview extends React.Component {
    constructor(props) {
        super(props);
        this.video = React.createRef();
        this.container = React.createRef();
        this.canvas = React.createRef();
        this.image = {
            intervalMs: 1000,
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
        const object = this;
        navigator.mediaDevices.getUserMedia({video: true, audio: false})
            .then((stream) => {
                console.log(stream);
                object.video.current.srcObject = stream;
                object.video.current.play();
                getFaceCoordinates(object.video.current)
                    .then(v => { object.handleRepeatImageDisplay(); }
)
            })
            .catch(function (err) {
                console.log("An error occurred there: " + err);
            });
    }

    componentWillUnmount() {
        this.video.current.pause();
        clearInterval(this.image.timeout);
        // this.video.current.removeEventListener('play', this.handleFaceCoordinates, false);
    }

    render() {
        return <div className="camera">
            <button id="button__take">Take photo</button>
            <video id="video" height="480" width="640" ref={this.video}/>
            <div className="image-container" ref={this.container} />
            {/*<canvas id="canvas" height="480" width="640" ref={this.canvas}/>*/}
        </div>;
    }
}

export default Camview;