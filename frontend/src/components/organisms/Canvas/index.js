import React from 'react';

import {getFaceCoordinates} from "./face";

import "./index.scss"


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

async function drawRectangleOnImage(image, video, lineWidth, strokeStyle) {
    const faceDimensions = await getFaceCoordinates(video);
    const vhs = image.height / video.videoHeight;
    const vws = image.width / video.videoWidth;
    const context = image.getContext("2d");
    image.width = image.clientWidth;
    image.height = image.clientHeight;
    context.drawImage(video, 0, 0, image.width, image.height);
    for (let i = 0; i < faceDimensions.length; ++i) {
        const iFace = faceDimensions[i];
        context.beginPath();
        context.strokeStyle=strokeStyle;
        context.lineWidth =lineWidth;
        context.rect(iFace.topLeftX * vws, iFace.topLeftY * vhs,iFace.width * vws, iFace.height * vhs);
        context.stroke();
    }
}


class Canvas extends React.Component {
    constructor(props) {
        super(props);
        this.canvas = React.createRef();
        this.video = React.createRef();
        this.container = React.createRef();
        this.image = {
            intervalMs: 100,
            timeout: null
        }
    }

    handleFaceCoordinates = (event) => {
        getFaceCoordinates(event.target)
            .then(v => console.log(v))
            .catch(e => console.log(e));
    }

    handleRepeatCanvasDisplay = () => {
        this.image.timeout = setInterval(() => {
            drawRectangleOnImage(this.canvas.current, this.video.current, "4", "green")
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
                    .then(v => { object.handleRepeatCanvasDisplay(); } )
                 })
            .catch(function (err) {
                console.log("An error occurred there: " + err);
            });
    }

    componentWillUnmount() {
        this.video.current.pause();
        clearInterval(this.image.timeout);
    }

    render() {
        return <div className="video-container">
            <video id="video" className="video-container__video" ref={this.video}/>
            <canvas id="canvas" className="background-canvas" ref={this.canvas}/>
            <div className="image-container" ref={this.container} />
        </div>;
    }
}


export default Canvas;