import { useState } from 'react'
import { useListen } from './effects'


export function useFaceID(socket, faceId) {
  const [data, setData] = useState(null)

  useListen(socket, "metadata", [setData], (data) => {
    if (data.face_id === faceId) setData(data)
  })

  return data
}
