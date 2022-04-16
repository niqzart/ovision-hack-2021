import { useEffect, useState } from 'react'
import io from "socket.io-client"


export function useSocketIO() {
  const [socket, setSocket] = useState(null)

  useEffect(() => {
    const socket = io(`https://${window.location.hostname}:5000`)
    socket.on("connect", () => console.log("sio connected", socket.id))
    socket.on("disconnect", () => console.log("sio disconnected", socket.id))
    setSocket(socket)
    return () => socket.disconnect()
  }, [setSocket])

  return socket
}

export function useListen(socket, event, handler, deps) {
  useEffect(() => {
    if (socket) {
      socket.on(event, handler)
      return () => socket.off(event, handler)
    }
  }, deps)
}
