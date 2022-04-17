export default class Emitter {
  constructor(socket) {
    this.socket = socket
  }

  emitImage(image) {
    this.socket.emit("stream", image)
  }

  emitFrame(canvas) {
    this.emitImage(canvas.toDataURL('image/webp'))
  }
}