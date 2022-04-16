import React from 'react';
import * as tf from '@tensorflow/tfjs'
const blazeface = require('@tensorflow-models/blazeface');

let model;

class FaceData {
    constructor(w, h, tlx, tly) {
        this.topLeftX = tlx;
        this.topLeftY = tly;
        this.width = w;
        this.height = h;
    }
    width;
    height;
    topLeftX;
    topLeftY;
}

async function getFaceCoordinates(video) {
    console.log(video)
    if (!model) model = await blazeface.load();
    const returnTensors = false;
    const predictions = await model.estimateFaces(video, returnTensors);
    let faceDimensions = [];
    if (predictions.length > 0) {
        for (let i = 0; i < predictions.length; i++) {
            const start = predictions[i].topLeft;
            const end = predictions[i].bottomRight;
            const x = end[0] - start[0];
            const y = end[1] - start[1];
            const tlx = predictions[i].topLeft[0];
            const tly = predictions[i].topLeft[1];
            faceDimensions.push(new FaceData(x,y, tlx, tly))
        }
    }
    return faceDimensions;
}

class Camview extends React.Component {
    constructor(props) {
        super(props);
        this.video = React.createRef();
        this.canvas = React.createRef();
    }

    componentDidMount() {
        // let video = document.getElementById('video');
        // let canvas = document.getElementById('canvas');
        // let context = canvas.getContext('2d')
        // let photo = document.getElementById('photo');
        // let startbutton = document.getElementById('startbutton');
        const object = this;
        navigator.mediaDevices.getUserMedia({video: true, audio: false})
            .then(function (stream) {
                console.log(object.video.current);
                object.video.current.srcObject = stream;
                object.video.current.play();
                object.video.current.addEventListener('play',function() {
                    getFaceCoordinates(object.video.current)
                        .then(v => console.log(v))
                        .catch(e => console.log(e));
                }, false);
            })
            .catch(function (err) {
                console.log("An error occurred there: " + err);
            });
    }

    componentWillUnmount() {
        this.video.current.removeEventListener('play', function() {
            getFaceCoordinates(this).catch(e => console.log(e)); },
            false);
    }

    render() {
        return <div class="camera">
            <button id="startbutton">Take photo</button>
            <video id="video" height="480" width="640" ref={this.video}/>
            <canvas id="canvas" height="480" width="640" ref={this.canvas}/>
        </div>;
    }
}

export default Camview;