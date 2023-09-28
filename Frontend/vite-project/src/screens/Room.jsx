import { useState, useEffect, createContext } from "react"
import Canvas from '../components/Canvas'
import ChatDialog from '../components/ChatDialog'
import SignOut from "../buttons/SignOut"

export const RoomContext = createContext()

export default function Room() {   
  
    const room_name = window.location.pathname.split('/')[2]
    const token = localStorage.getItem('token')
    const socketURL = "ws://127.0.0.1:8000/ws/chat/"
    axios.defaults.headers.common = {'Authorization': `Token ${token}`}
    
    const [username, setUsername] = useState("")

    useEffect(() => {
        axios.post(`user/profile/`)
        .then(({data}) => {
          setUsername(data.username)
        })
        .catch((err) => {
          alert("Error Occured")
        })
    }, [])

    const contextObject = {
      room_name,
      username,
      socketURL,
      token,
      drawSocket: new WebSocket(`${socketURL}${room_name}/?token=${token}`),
      chatSocket: new WebSocket(`${socketURL}text/${room_name}/?token=${token}`),
    }

    return <>
        <RoomContext.Provider value={contextObject}>
          <SignOut />
          <Canvas/>
          <ChatDialog/>
        </RoomContext.Provider>
    </>
}
