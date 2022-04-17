import * as tf from "@tensorflow/tfjs"
const blazeface = require("@tensorflow-models/blazeface");

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


export async function getFaceCoordinates(video) {
    const inc_y = 2.0;
    const mov_down_y = 0.65;
    if (!model) model = await blazeface.load();
    const returnTensors = false;
    const predictions = await model.estimateFaces(video, returnTensors);
    let faceDimensions = [];
    if (predictions.length > 0) {
        for (let i = 0; i < predictions.length; ++i) {
            const start = predictions[i].topLeft;
            const end = predictions[i].bottomRight;
            const x = end[0] - start[0];
            const y = (end[1] - start[1]) * inc_y;
            const tlx = start[0];
            const tly = (start[1]) - (y * (inc_y - 1 - mov_down_y));
            faceDimensions.push(new FaceData(x, y, tlx, tly))
        }
    }
    return faceDimensions;
}

