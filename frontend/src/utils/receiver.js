import { useState } from "react"
import { useListen } from "./effects"


export default function useReceiver(socket) {
    const [data, setData] = useState(null)

    useListen(socket, "metadata", [setData], setData)

    return data
}
