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

function transformIFace(iFace) {
    let x_center = iFace.topLeftX + iFace.width / 2;
    let y_center = iFace.topLeftY + iFace.height / 2;
    let max_dim = Math.max(iFace.width, iFace.height);
    return {'x': x_center - max_dim / 2, 'y': y_center - max_dim / 2, 'width': max_dim, 'height': max_dim}
}

const profileImageDim = 200;

function fillTransformedSegments(container, video, faceDimensions) {
    container.width = profileImageDim;
    container.height = profileImageDim * faceDimensions.length;
    const context = container.getContext("2d");
    for (let i = 0; i < faceDimensions.length; ++i) {
        const iFace = faceDimensions[i];
        let data = transformIFace(iFace);
        context.drawImage(video, data['x'], data['y'], data['width'], data['height'],
            0, profileImageDim * i, profileImageDim, profileImageDim);
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
    fillTransformedSegments(container, video, faceDimensions);
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
            <canvas id="container" ref={this.container}/>
            <video id="video" className="canvas-container__video" ref={this.video}/>
            <canvas id="canvas" className="canvas-container__canvas" ref={this.canvas}/>
        </div>;
    }
}


export default Canvas;