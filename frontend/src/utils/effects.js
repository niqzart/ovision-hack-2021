import { useEffect, useState } from 'react'
import io from "socket.io-client"

export function useSocketIO() {
  const [socket, setSocket] = useState(null)

  useEffect(() => {
    const socket = io("http://localhost:5000")
    socket.on("connect", () => console.log("sio connected", socket.id))
    socket.on("disconnect", () => console.log("sio disconnected", socket.id))
    setSocket(socket)
    return () => socket.disconnect()
  }, [setSocket])

  return socket
}