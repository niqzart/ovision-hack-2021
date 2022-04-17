import React from 'react';

import { getFaceCoordinates } from "./face";

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
    return { 'x': x_center - max_dim / 2, 'y': y_center - max_dim / 2, 'width': max_dim, 'height': max_dim }
}

function getIoU(iFace1, iFace2) {
    let s1 = iFace1.width * iFace1.height;
    let s2 = iFace2.width * iFace2.height;

    let min_x = Math.max(iFace1.topLeftX, iFace2.topLeftX);
    let min_y = Math.max(iFace1.topLeftY, iFace2.topLeftY);
    let max_x = Math.min(iFace1.topLeftX + iFace1.width, iFace2.topLeftX + iFace2.width);
    let max_y = Math.min(iFace1.topLeftY + iFace1.height, iFace2.topLeftY + iFace2.height);

    let dx = Math.max(max_x - min_x, 0);
    let dy = Math.max(max_y - min_y, 0);

    let intersect_square = dx * dy;
    let union_square = s1 + s2 - intersect_square;

    return intersect_square / union_square;
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
        context.strokeStyle = canvasStrokeStyle;
        context.lineWidth = canvasLineWidth;
        context.rect(iFace.topLeftX * vws, iFace.topLeftY * vhs, iFace.width * vws, iFace.height * vhs);
        context.stroke();
    }
}

async function processVideo(container, video, canvas, state, emitter) {
    let faceDimensions = await getFaceCoordinates(video);
    let integrated = [];
    let integratedState = [];
    for (let i = 0; i < faceDimensions.length; ++i) {
        const iFace = faceDimensions[i];
        for (let j = 0; j < state.faceDimensions.length; ++j) {
            const iStateFace = state.faceDimensions[j];
            let IoU = getIoU(iFace, iStateFace);
            if (IoU > 0.5) {
                state.faceDimensions[j] = iFace;
                integrated.push(i);
                integratedState.push(j);
                break
            }
        }
    }
    for (let i = state.faceDimensions.length - integrated.length - 1; i >= 0; --i) {
        if (integratedState.includes(i)) {
            continue;
        }
        state.faceDimensions.splice(i);
        console.log('face out of frame');
    }
    for (let i = 0; i < faceDimensions.length; ++i) {
        if (integrated.includes(i)) {
            continue;
        }
        const iFace = faceDimensions[i];
        state.faceDimensions.push(iFace);
        console.log('new face in frame');
    }
    fillTransformedSegments(container, video, state.faceDimensions);
    emitter.emitFrame(canvas)
    drawRectangleVideo(canvas, video, state.faceDimensions)
}


class Canvas extends React.Component {
    constructor(props) {
        super(props);
        this.emitter = props.emitter;
        this.canvas = React.createRef();
        this.video = React.createRef();
        this.container = React.createRef();
        this.state = { faceDimensions: [] }
        this.processData = {
            intervalMs: 100,
            timeout: null
        }
    }


    handleRepeatCanvasDisplayAndCut = () => {
        this.canvas.current.width = this.video.current.videoWidth;
        this.canvas.current.height = this.video.current.videoHeight;
        this.processData.timeout = setInterval(() => {
            processVideo(this.container.current, this.video.current, this.canvas.current, this.state, this.emitter)
                .catch(e => console.log(e));
        }, this.processData.intervalMs);
    }


    componentDidMount() {
        const object = this;
        navigator.mediaDevices.getUserMedia({ video: true, audio: false })
            .then((stream) => {
                console.log(stream);
                object.video.current.srcObject = stream;
                object.video.current.play();
                getFaceCoordinates(object.video.current)
                    .then(() => {
                        object.handleRepeatCanvasDisplayAndCut();
                    })
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
            <canvas id="container" ref={this.container} />
            <video id="video" className="canvas-container__video" ref={this.video} />
            <canvas id="canvas" className="canvas-container__canvas" ref={this.canvas} />
        </div>;
    }
}


export default Canvas;