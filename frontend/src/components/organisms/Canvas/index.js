import React from 'react';

import {getFaceCoordinates} from "./face";

import "./index.scss"


const canvasLineWidth = "5";
const canvasStrokeStyle = "green";


function scaleChildFitParentMaxWidthOrHeight(child) {
    const parent = child.parentElement;
    const scaleX = parent.clientWidth / child.width;
    const scaleY = parent.clientHeight / child.height;
    const scalePercent = scaleX < scaleY ? scaleX : scaleY;
    if (scalePercent === 1.) return;
    child.width *= scalePercent;
    child.height *= scalePercent;
}

const profileImageDim = 150;

function fillTransformedSegments(container, video, faceDimensions) {
    for (let i = faceDimensions.length; i < container.childElementCount; ++i) {
        container.removeChild(container.children[i]);
    }
    for (let i = container.childElementCount; i < faceDimensions.length; ++i) {
        container.appendChild(document.createElement("canvas"));
    }
    for (let i = 0; i < faceDimensions.length; ++i) {
        const iFace = faceDimensions[i];
        container.children[i].setAttribute("width", profileImageDim);
        container.children[i].setAttribute("height", profileImageDim);
        let context = container.children[i].getContext("2d");
        context.drawImage(video, iFace.topLeftX, iFace.topLeftY, iFace.width, iFace.height,
            0, 0, profileImageDim, profileImageDim);
    }
}

function drawRectangleVideo(canvas, video, faceDimensions) {
    const vhs = canvas.height / video.videoHeight;
    const vws = canvas.width / video.videoWidth;
    scaleChildFitParentMaxWidthOrHeight(canvas);
    const context = canvas.getContext("2d");
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    for (let i = 0; i < faceDimensions.length; ++i) {
        const iFace = faceDimensions[i];
        context.beginPath();
        context.strokeStyle=canvasStrokeStyle;
        context.lineWidth =canvasLineWidth;
        context.rect(iFace.topLeftX * vws, iFace.topLeftY * vhs,iFace.width * vws, iFace.height * vhs);
        context.stroke();
    }
}

async function processVideo(container, video, canvas) {
    let faceDimensions = await getFaceCoordinates(video);
    drawRectangleVideo(canvas, video, faceDimensions)
    // fillTransformedSegments(container, video, faceDimensions);
}


class Canvas extends React.Component {
    constructor(props) {
        super(props);
        this.canvas = React.createRef();
        this.video = React.createRef();
        this.container = React.createRef();
        this.processData = {
            intervalMs: 100,
            timeout: null
        }
    }


    handleRepeatCanvasDisplayAndCut = () => {
        this.canvas.current.width = this.video.current.videoWidth;
        this.canvas.current.height = this.video.current.videoHeight;
        this.processData.timeout = setInterval(() => {
            processVideo(this.container.current, this.video.current, this.canvas.current).catch(e => console.log(e));
        }, this.processData.intervalMs);
    }


     componentDidMount() {
        const object = this;
        navigator.mediaDevices.getUserMedia({video: true, audio: false})
            .then((stream) => {
                console.log(stream);
                object.video.current.srcObject = stream;
                object.video.current.play();
                getFaceCoordinates(object.video.current)
                    .then(() => {
                        object.handleRepeatCanvasDisplayAndCut();
                    } )
                 })
            .catch(function (err) {
                console.log("An error occurred there: " + err);
            });
    }

    componentWillUnmount() {
        this.video.current.pause();
        clearInterval(this.processData.timeout);
    }

    render() {
        return <div className="canvas-container" >
            <div id="container" ref={this.container}/>
            <video id="video" className="canvas-container__video" ref={this.video}/>
            <canvas id="canvas" className="canvas-container__canvas" ref={this.canvas}/>
        </div>;
    }
}


export default Canvas;