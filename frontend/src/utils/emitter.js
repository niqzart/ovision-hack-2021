export default class Emitter {
  constructor(socket) {
    this.socket = socket
  }

  emitImage(face_id, image) {
    socket.emit("stream", { face_id, image })
  }

  emitFrame(face_id, canvas) {
    this.emitImage(face_id, canvas.toDataURL('image/webp'))
  }
}