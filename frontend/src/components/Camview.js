import React from 'react';
import * as tf from '@tensorflow/tfjs'
const blazeface = require('@tensorflow-models/blazeface');

class Camview extends React.Component {
    model;
    draw = async function draw(video, context, width, height) {
            console.log(video);
            context.drawImage(video, 0, 0, width, height);
            if (!video.model) video.model = await blazeface.load();
            const returnTensors = false;
            const predictions = await video.model.estimateFaces(video, returnTensors);
            if (predictions.length > 0) {
                console.log(predictions);
                for (let i = 0; i < predictions.length; i++) {
                    const start = predictions[i].topLeft;
                    const end = predictions[i].bottomRight;
                    const probability = predictions[i].probability;
                    const size = [end[0] - start[0], end[1] - start[1]];
                    // Render a rectangle over each detected face.
                    context.beginPath();
                    context.strokeStyle = "green";
                    context.lineWidth = "4";
                    context.rect(start[0], start[1], size[0], size[1]);
                    context.stroke();
                    const prob = (probability[0] * 100).toPrecision(5).toString();
                    const text = prob + "%";
                    context.fillStyle = "red";
                    context.font = "13pt sans-serif";
                    context.fillText(text, start[0] + 5, start[1] + 20);
                }
            }
            setTimeout(draw, 250, video, context, width, height);
        };

    componentDidMount() {
        let video = document.getElementById('video');
        let canvas = document.getElementById('canvas');
        let context = canvas.getContext('2d')
        let photo = document.getElementById('photo');
        let startbutton = document.getElementById('startbutton');
        let current = this;
        navigator.mediaDevices.getUserMedia({video: true, audio: false})
            .then(function (stream) {
                video.srcObject = stream;
                console.log(stream);
                video.play();
                video.addEventListener('play',function() {
                    current.draw(this, context, this.clientWidth, this.clientHeight).catch(e => console.log(e));
                }, false);
            })
            .catch(function (err) {
                console.log("An error occurred: " + err);
            });
    }

    componentWillUnmount() {
        let video = document.getElementById('video');
        let canvas = document.getElementById('canvas');
        let context = canvas.getContext('2d')
        let current = this;
        video.removeEventListener('play', function() {
            current.draw(this, context, this.clientHeight, this.clientWidth).catch(e => console.log(e)); },
            false);
    }

    render() {
        return <div class="camera">
            <button id="startbutton">Take photo</button>
            <video id="video" height="480" width="640"/>
            <canvas id="canvas" height="480" width="640"/>
        </div>;
    }
}

export default Camview;