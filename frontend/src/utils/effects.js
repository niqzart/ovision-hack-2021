import { useEffect, useState } from "react"
import io from "socket.io-client"


export function useSocketIO() {
    const [socket, setSocket] = useState(null)

    useEffect(() => {
        console.log(`Attempting connection to ${window.location.protocol}//${window.location.hostname}:5000`)
        const socket = io(`${window.location.protocol}//${window.location.hostname}:5000`)
        socket.on("connect", () => console.log("sio connected", socket.id))
        socket.on("disconnect", () => console.log("sio disconnected", socket.id))
        setSocket(socket)
        return () => socket.disconnect()
    }, [setSocket])

    return socket
}

export function useListen(socket, event, deps, handler) {
    useEffect(() => {
        if (socket) {
            console.log("Listening for", event)
            socket.on(event, handler)
            return () => socket.off(event, handler)
        }
    }, [socket, event, handler, ...deps])
}

export function useWindowSize() {
    const [[width, height], setSize] = useState([0, 0])

    useEffect(() => {
        function updateSize() { setSize([window.innerWidth, window.innerHeight]) }
        window.addEventListener("resize", updateSize)
        updateSize()
        return () => window.removeEventListener("resize", updateSize)
    }, [setSize])

    return width, height
}
