import React from 'react';

class Camview extends React.Component {
    componentDidMount() {
            let video = document.getElementById('video');
            let canvas = document.getElementById('canvas');
            let photo = document.getElementById('photo');
            let startbutton = document.getElementById('startbutton');
            navigator.mediaDevices.getUserMedia({ video: true, audio: false })
                .then(function(stream) {
                    video.srcObject = stream;
                    video.play();
                })
                .catch(function(err) {
                console.log("An error occurred: " + err);
            });

    }
    render() {
      return  <div class="camera">
      <video id="video">Video stream not available.</video>
      <button id="startbutton">Take photo</button>
    </div>;
    }
  }
export default Camview;