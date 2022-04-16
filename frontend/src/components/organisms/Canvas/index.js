import React from 'react';

import {getFaceCoordinates} from "./face";

import "./index.scss"


function scaleChildFitParentMaxWidthOrHeight(child) {
    const parent = child.parentElement;
    const scaleX = parent.clientWidth / child.width;
    const scaleY = parent.clientHeight / child.height;
    const scalePercent = scaleX < scaleY ? scaleX : scaleY;
    if (scalePercent === 1.) return;
    child.width *= scalePercent;
    child.height *= scalePercent;
}


async function getTransformedImageFromVideo(canvas_container, video, width, height) {
    let faceDimensions = await getFaceCoordinates(video);
    for (let i = faceDimensions.length; i < canvas_container.childElementCount; ++i) {
        canvas_container.removeChild(canvas_container.children[i]);
    }
    for (let i = canvas_container.childElementCount; i < faceDimensions.length; ++i) {
        canvas_container.appendChild(document.createElement("canvas"));
    }
    for (let i = 0; i < faceDimensions.length; ++i) {
        const iFace = faceDimensions[i];
        canvas_container.children[i].setAttribute("width", width);
        canvas_container.children[i].setAttribute("height", height);
        let context = canvas_container.children[i].getContext("2d");
        context.drawImage(video, iFace.topLeftX, iFace.topLeftY, iFace.width, iFace.height, 0, 0, width, height);
    }
}

async function drawRectangleOnImage(canvas, video, lineWidth, strokeStyle) {
    const faceDimensions = await getFaceCoordinates(video);
    const vhs = canvas.height / video.videoHeight;
    const vws = canvas.width / video.videoWidth;
    const context = canvas.getContext("2d");
    scaleChildFitParentMaxWidthOrHeight(canvas);
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
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
        this.canvas.current.width = this.video.current.videoWidth;
        this.canvas.current.height = this.video.current.videoHeight;
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
        return <div className="canvas-container">
            <video id="video" className="canvas-container__video" ref={this.video}/>
            <canvas id="canvas" className="canvas-container__canvas" ref={this.canvas}/>
        </div>;
    }
}


export default Canvas;