import { useState, useEffect, createContext } from "react"

import Lobby from "../components/Lobby"
import SignOut from "../buttons/SignOut"

export const LobbyContext = createContext()

export default function Home() 
{
    const token = localStorage.getItem('token')
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
        username,
        token,
      }

    return <>
        <LobbyContext.Provider value={contextObject}>
            <Lobby />
            <SignOut />
        </LobbyContext.Provider>
    </>
}