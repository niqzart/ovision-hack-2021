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

export async function getTransformedImageFromVideo(image_container, video, width, height) {
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


export async function getFaceCoordinates(video) {
    if (!model) model = await blazeface.load();
    const returnTensors = false;
    const predictions = await model.estimateFaces(video, returnTensors);
    let faceDimensions = [];
    if (predictions.length > 0) {
        for (let i = 0; i < predictions.length; ++i) {
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

